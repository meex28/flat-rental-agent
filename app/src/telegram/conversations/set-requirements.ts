import {InlineKeyboard} from "grammy";
import {OwnershipType, PropertyType} from "@prisma/client";
import {BotContext, BotConversation} from "../types";
import {saveUserOfferRequirements} from "../../service/offer-requirements.service";
import {CreateOfferRequirementsDto} from "../../dto/offer-requirements";

const propertyTypes = Object.values(PropertyType);
const ownershipTypes = Object.values(OwnershipType);

const setRequirementsConversation = async (conversation: BotConversation, ctx: BotContext) => {
  await ctx.reply(ctx.t("set-requirements-start"));

  const propertyTypeKeyboard = new InlineKeyboard();
  propertyTypes.forEach(type => propertyTypeKeyboard.text(type, type));
  await ctx.reply(ctx.t("set-requirements-property-type-question"), {reply_markup: propertyTypeKeyboard});
  const propertyTypeCtx = await conversation.wait();
  const propertyType = propertyTypeCtx.callbackQuery?.data?.toUpperCase() as PropertyType;
  if (!propertyTypes.includes(propertyType)) {
    await ctx.reply(ctx.t("invalid-input-using-buttons"));
    return;
  }

  const ownershipTypeKeyboard = new InlineKeyboard();
  ownershipTypes.forEach(type => ownershipTypeKeyboard.text(type, type));
  await ctx.reply(ctx.t("set-requirements-ownership-type-question"), {reply_markup: ownershipTypeKeyboard});
  const ownershipTypeCtx = await conversation.wait();
  const ownershipType = ownershipTypeCtx.callbackQuery?.data?.toUpperCase() as OwnershipType;
  if (!ownershipTypes.includes(ownershipType)) {
    await ctx.reply(ctx.t("invalid-input-using-buttons"));
    return;
  }

  await ctx.reply(ctx.t("set-requirements-location-name-question"));
  const locationCtx = await conversation.wait();
  const location = {name: locationCtx.message?.text || '', distance: 0};

  const distance = await handleOptionalNumericInput(
    ctx,
    conversation,
    ctx.t("set-requirements-location-distance-question"),
    0
  );
  location.distance = distance ?? 0;

  const minPrice = await handleOptionalNumericInput(
    ctx,
    conversation,
    ctx.t("set-requirements-min-price-question"),
    0
  );

  const maxPrice = await handleOptionalNumericInput(
    ctx,
    conversation,
    ctx.t("set-requirements-max-price-question"),
    minPrice
  );

  const minSize = await handleOptionalNumericInput(
    ctx,
    conversation,
    ctx.t("set-requirements-min-size-question"),
    0
  );

  const maxSize = await handleOptionalNumericInput(
    ctx,
    conversation,
    ctx.t("set-requirements-max-size-question"),
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

  const summary = generateRequirementsSummary(ctx, offerRequirements);
  await ctx.reply(ctx.t("set-requirements-finish") + " " + summary);

  const chatId = ctx.from?.id;
  if (chatId) {
    await saveUserOfferRequirements(chatId, offerRequirements);
  }

  await ctx.reply(ctx.t("set-requirements-save-finish"));
};

export const generateRequirementsSummary = (ctx: BotContext, requirements: CreateOfferRequirementsDto): string => {
  const addRange = (
    label: string,
    min: number | undefined | null,
    max: number | undefined | null,
    unit: string,
  ): string => {
    if (min != undefined && max != undefined) {
      return `\n- ${label}: ${ctx.t("full-range", {min, max, unit})}`;
    } else if (min != undefined) {
      return `\n- ${label}: ${ctx.t("lower-bound-range", {min, unit})}`;
    } else if (max != undefined) {
      return `\n- ${label}: ${ctx.t("upper-bound-range", {max, unit})}`;
    }
    return '';
  };

  let summary = `${ctx.t("set-requirements-summary-message")}\n` +
    `- ${ctx.t("property-type")}: ${requirements.propertyType}\n` +
    `- ${ctx.t("purpose")}: ${requirements.ownershipType}\n` +
    `- ${ctx.t("location")}: ${requirements.location.name}`;

  if (requirements.location.distance > 0) {
    summary += ` ${ctx.t("distance-range-value", {distance: requirements.location.distance})}`;
  }

  summary += addRange(
    ctx.t("price"),
    requirements.minPrice,
    requirements.maxPrice,
    "PLN"
  );

  summary += addRange(
    ctx.t("size"),
    requirements.minSize,
    requirements.maxSize,
    "m²"
  );

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
    minValue === undefined
      ? ctx.t("optional-numeric-input-error")
      : ctx.t("optional-numeric-input-boundary-error", {minValue})
  )

  return await handleOptionalNumericInput(ctx, conversation, prompt, minValue);
};

export {setRequirementsConversation};