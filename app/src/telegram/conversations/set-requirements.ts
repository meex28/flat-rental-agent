import {InlineKeyboard} from "grammy";
import {OwnershipType, PropertyType} from "@prisma/client";
import {AvailableCommands, BotContext, BotConversation} from "../types";
import {saveUserOfferRequirements} from "../../service/offer-requirements.service";
import {CreateOfferRequirementsDto} from "../../dto/offer-requirements";

const propertyTypes = Object.values(PropertyType);
const ownershipTypes = Object.values(OwnershipType);

const invalidInputUsingButtonsMessage = "Please use the provided buttons to make your selection. If you don't see the buttons, you may need to update your Telegram app.";

const setRequirementsConversation = async (conversation: BotConversation, ctx: BotContext) => {
  await ctx.reply("Hi! I'll help you set up your preferences for offers you will be notified about. Let's get started!");

  const propertyTypeKeyboard = new InlineKeyboard();
  propertyTypes.forEach(type => propertyTypeKeyboard.text(type, type));
  await ctx.reply("What type of property are you interested in?", {reply_markup: propertyTypeKeyboard});
  const propertyTypeCtx = await conversation.wait();
  const propertyType = propertyTypeCtx.callbackQuery?.data?.toUpperCase() as PropertyType;
  if (!propertyTypes.includes(propertyType)) {
    await ctx.reply(invalidInputUsingButtonsMessage);
    return;
  }

  const ownershipTypeKeyboard = new InlineKeyboard();
  ownershipTypes.forEach(type => ownershipTypeKeyboard.text(type, type));
  await ctx.reply("Great choice! Are you looking to buy or rent?", {reply_markup: ownershipTypeKeyboard});
  const ownershipTypeCtx = await conversation.wait();
  const ownershipType = ownershipTypeCtx.callbackQuery?.data?.toUpperCase() as OwnershipType;
  if (!ownershipTypes.includes(ownershipType)) {
    await ctx.reply(invalidInputUsingButtonsMessage);
    return;
  }

  await ctx.reply('Understood. Now, where are you looking for this property? Please provide the city name without Polish characters, e.g., "Krakow".');
  const locationCtx = await conversation.wait();
  const location = {name: locationCtx.message?.text || '', distance: 0};

  const distance = await handleOptionalNumericInput(
    ctx,
    conversation,
    "How far from this location would you like to search? (Enter distance in kilometers, or type \"0\" if not applicable)",
    0
  );
  location.distance = distance ?? 0;

  const minPrice = await handleOptionalNumericInput(
    ctx,
    conversation,
    'Great! Now, let\'s set the minimum price in PLN (optional). Enter a number or type "skip" to omit.',
    0
  );

  const maxPrice = await handleOptionalNumericInput(
    ctx,
    conversation,
    'Great! Now, let\'s set the maximum price in PLN (optional). Enter a number or type "skip" to omit.',
    minPrice
  );

  const minSize = await handleOptionalNumericInput(
    ctx,
    conversation,
    'Great! Now, let\'s set the minimum size in square meters (m²) (optional). Enter a number or type "skip" to omit.',
    0
  );

  const maxSize = await handleOptionalNumericInput(
    ctx,
    conversation,
    'Finally, let\'s set the maximum size in square meters (m²) (optional). Enter a number or type "skip" to omit.',
    minSize
  );

  const offerRequirements: CreateOfferRequirementsDto = {
    propertyType,
    ownershipType,
    location,
    minPrice,
    maxPrice,
    minSize,
    maxSize
  };

  const summary = generateRequirementsSummary(offerRequirements);
  await ctx.reply(summary);

  const chatId = ctx.from?.id;
  if (chatId) {
    await saveUserOfferRequirements(chatId, offerRequirements);
  }

  await ctx.reply(
    "I've saved these preferences and will start sending you notifications when matching offers are found. " +
    `You can update these preferences anytime by typing /${AvailableCommands.SET_REQUIREMENTS}.`
  );
};

const generateRequirementsSummary = (requirements: CreateOfferRequirementsDto): string => {
  let summary = "Thank you for providing all the details. Here's a summary of your requirements:" +
    `\n- Property type: ${requirements.propertyType}` +
    `\n- Purpose: ${requirements.ownershipType}` +
    `\n- Location: ${requirements.location.name}`;

  if (requirements.location.distance > 0) {
    summary += ` (+${requirements.location.distance} km)`;
  }

  if (requirements.minPrice !== undefined || requirements.maxPrice !== undefined) {
    summary += '\n- Price range:';
    if (requirements.minPrice !== undefined) summary += ` From ${requirements.minPrice} PLN`;
    if (requirements.maxPrice !== undefined) summary += ` Up to ${requirements.maxPrice} PLN`;
  }

  if (requirements.minSize !== undefined || requirements.maxSize !== undefined) {
    summary += '\n- Size range:';
    if (requirements.minSize !== undefined) summary += ` From ${requirements.minSize} m²`;
    if (requirements.maxSize !== undefined) summary += ` Up to ${requirements.maxSize} m²`;
  }

  return summary;
};

const handleOptionalNumericInput = async (
  ctx: BotContext,
  conversation: BotConversation,
  prompt: string,
  minValue?: number
): Promise<number | undefined> => {
  await ctx.reply(prompt);
  const input = (await conversation.wait()).message?.text;

  if (input?.toLowerCase() === 'skip') {
    return undefined;
  }

  const value = Number(input);
  if (!isNaN(value) && (minValue === undefined || value >= minValue)) {
    return value;
  }

  await ctx.reply(
    `Please enter a valid number${minValue !== undefined ? ` greater than or equal to ${minValue}` : ''} or type "skip" to omit.`
  )

  return await handleOptionalNumericInput(ctx, conversation, prompt, minValue);
};

export {setRequirementsConversation};