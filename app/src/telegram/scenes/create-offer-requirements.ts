import {WizardScene} from "telegraf/scenes";
import {OwnershipType, PropertyType} from "@prisma/client";
import {Markup} from "telegraf";
import {AvailableCommands, AvailableScenes} from "../types";
import {saveUserOfferRequirements} from "../../service/offer-requirements.service";
import {handleOptionalNumericInput} from "./utils";
import {CreateOfferRequirementsDto} from "../../dto/offer-requirements";

const propertyTypes = Object.values(PropertyType);
const ownershipTypes = Object.values(OwnershipType);

const invalidInputUsingButtonsMessage = "Please use the provided buttons to make your selection. If you don't see the buttons, you may need to update your Telegram app.";

// TODO: Replace 'any' with the correct type from your Telegraf setup
export const createOfferRequirements = new WizardScene<any>(
  AvailableScenes.CREATE_OFFER_REQUIREMENTS,
  async (ctx) => {
    await ctx.reply("Hi! I'll help you set up your preferences for offers you will be notified about. Let's get started!");
    await ctx.reply(
      "What type of property are you interested in?",
      Markup.inlineKeyboard(propertyTypes.map(type => Markup.button.callback(type, type)))
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    const propertyType = ctx.callbackQuery?.data?.toUpperCase() as PropertyType;
    if (!propertyTypes.includes(propertyType)) {
      await ctx.reply(invalidInputUsingButtonsMessage);
      return;
    }
    ctx.wizard.state.offerRequirements = {propertyType};
    await ctx.reply(
      "Great choice! Are you looking to buy or rent?",
      Markup.inlineKeyboard(ownershipTypes.map(type => Markup.button.callback(type, type)))
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    const ownershipType = ctx.callbackQuery?.data?.toUpperCase() as OwnershipType;
    if (!ownershipTypes.includes(ownershipType)) {
      await ctx.reply(invalidInputUsingButtonsMessage);
      return;
    }
    ctx.wizard.state.offerRequirements.ownershipType = ownershipType;
    await ctx.reply('Understood. Now, where are you looking for this property? Please provide the city name without Polish characters, e.g., "Krakow".');
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      await ctx.reply("I'm sorry, I couldn't recognize that city name. Please try again with a valid Polish city name, without using Polish characters.");
      return;
    }

    ctx.wizard.state.offerRequirements.location = {};
    ctx.wizard.state.offerRequirements.location.name = ctx.message.text;

    await ctx.reply('How far from this location would you like to search? (Enter distance in kilometers, or type "0" if not applicable)');

    return ctx.wizard.next();
  },
  async (ctx) => {
    const distance = await handleOptionalNumericInput(ctx, "distance", 0);
    if (distance && Number.isNaN(distance)) {
      return;
    }
    ctx.wizard.state.offerRequirements.location.distance = distance ?? 0;

    await ctx.reply('Great! Now, let\'s set the minimum price in PLN (optional). Enter a number or type "skip" to omit.');
    return ctx.wizard.next();
  },
  async (ctx) => {
    const minPrice = await handleOptionalNumericInput(ctx, 'minPrice');
    if (minPrice && Number.isNaN(minPrice)) {
      return;
    }
    ctx.wizard.state.offerRequirements.minPrice = minPrice;
    await ctx.reply('Great! Now, let\'s set the maximum price in PLN (optional). Enter a number or type "skip" to omit.');
    return ctx.wizard.next();
  },
  async (ctx) => {
    const maxPrice = await handleOptionalNumericInput(ctx, 'maxPrice', ctx.wizard.state.offerRequirements.minPrice);
    if (maxPrice && Number.isNaN(maxPrice)) {
      return;
    }
    ctx.wizard.state.offerRequirements.maxPrice = maxPrice;
    await ctx.reply('Great! Now, let\'s set the minimum size in square meters (m²) (optional). Enter a number or type "skip" to omit.');
    return ctx.wizard.next();
  },
  async (ctx) => {
    const minSize = await handleOptionalNumericInput(ctx, 'minSize');
    if (minSize && isNaN(minSize)) {
      return;
    }
    ctx.wizard.state.offerRequirements.minSize = minSize;
    await ctx.reply('Finally, let\'s set the maximum size in square meters (m²) (optional). Enter a number or type "skip" to omit.');
    return ctx.wizard.next();
  },
  async (ctx) => {
    const maxSize = await handleOptionalNumericInput(ctx, 'maxSize', ctx.wizard.state.offerRequirements.minSize);
    if (maxSize && isNaN(maxSize)) {
      return;
    }
    ctx.wizard.state.offerRequirements.maxSize = maxSize;

    const summary = generateRequirementsSummary(ctx.wizard.state.offerRequirements);
    await ctx.reply(summary);

    const chatId = ctx.from.id;
    await saveUserOfferRequirements(chatId, ctx.wizard.state.offerRequirements);

    await ctx.reply(
      "I've saved these preferences and will start sending you notifications when matching offers are found. " +
      `You can update these preferences anytime by typing /${AvailableCommands.SET_REQUIREMENTS}.`
    );

    return ctx.scene.leave();
  }
);

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
