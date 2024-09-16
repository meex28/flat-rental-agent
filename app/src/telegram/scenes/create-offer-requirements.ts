import {WizardScene} from "telegraf/scenes";
import {OwnershipType, PropertyType} from "@prisma/client";
import {Markup} from "telegraf";
import {AvailableScenes} from "../types";
import {saveUserOfferRequirements} from "../../service/offer-requirements.service";

const propertyTypes = Object.values(PropertyType);
const ownershipTypes = Object.values(OwnershipType);

const invalidInputUsingButtonsMessage = "Please use the provided buttons to make your selection. If you don't see the buttons, you may need to update your Telegram app.";

// TODO: add leaving scene
// TODO: replace `any` with correct type
export const createOfferRequirements = new WizardScene<any>(
  AvailableScenes.CREATE_OFFER_REQUIREMENTS,
  (ctx) => {
    ctx.reply(
      "Hi! I'll help you set up your preferences for offers you will be notified about. Let's get started!"
    )
    ctx.reply(
      `What type of property are you interested in?`,
      Markup.inlineKeyboard(
        Object.values(PropertyType).map((type) =>
          Markup.button.callback(type, type)
        )
      )
    );
    return ctx.wizard.next();
  },
  (ctx) => {
    const propertyType = ctx.callbackQuery?.data?.toUpperCase();
    if (!propertyTypes.includes(propertyType)) {
      ctx.reply(invalidInputUsingButtonsMessage);
      return;
    }
    ctx.wizard.state.offerRequirements = {propertyType};
    ctx.reply(`Great choice! Are you looking to buy or rent?`,
      Markup.inlineKeyboard(
        ownershipTypes.map((type) =>
          Markup.button.callback(type, type)
        )
      )
    );
    return ctx.wizard.next();
  },
  (ctx) => {
    const ownershipType = ctx.callbackQuery?.data?.toUpperCase();
    if (!ownershipTypes.includes(ownershipType)) {
      ctx.reply(invalidInputUsingButtonsMessage);
      return;
    }
    ctx.wizard.state.offerRequirements.ownershipType = ownershipType;
    ctx.reply('Understood. Now, where are you looking for this property? Please provide the city name without Polish characters, e.g., "Krakow".');
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("I'm sorry, I couldn't recognize that city name. Please try again with a valid Polish city name, without using Polish characters.");
      return;
    }
    const localization = ctx.message.text;
    ctx.wizard.state.offerRequirements.localization = localization;

    const {propertyType, ownershipType} = ctx.wizard.state.offerRequirements;
    ctx.reply(`Thank you for providing all the details. Here's a summary of your requirements:
    - Property type: ${propertyType}
    - Purpose: ${ownershipType}
    - Location: ${localization}`
    );

    const chatId = ctx.from.id;
    await saveUserOfferRequirements(chatId, {propertyType, ownershipType, localization});

    ctx.reply(
      "I've saved these preferences and will start sending you notifications when matching offers are found. " +
      "You can update these preferences anytime by typing /set_requirements."
    );

    return ctx.scene.leave();
  }
);