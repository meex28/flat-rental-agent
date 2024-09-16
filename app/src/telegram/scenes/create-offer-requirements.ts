import {WizardScene} from "telegraf/scenes";
import {OwnershipType, PropertyType} from "@prisma/client";
import {Markup} from "telegraf";
import {AvailableScenes} from "../types";

const propertyTypes = Object.values(PropertyType);
const propertyTypesString = propertyTypes.join(', ');
const ownershipTypes = Object.values(OwnershipType);
const ownershipTypesString = ownershipTypes.join(' or ');

// TODO: replace `any` with correct type
export const createOfferRequirements = new WizardScene<any>(
  AvailableScenes.CREATE_OFFER_REQUIREMENTS,
  (ctx) => {
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
    if (!ctx.callbackQuery || !ctx.callbackQuery.data) {
      ctx.reply(`Please select a property type using the buttons provided.`);
      return;
    }
    const propertyType = ctx.callbackQuery.data.toUpperCase();
    if (!propertyTypes.includes(propertyType)) {
      ctx.reply(`Invalid input. Please choose one of the following: ${propertyTypesString}`);
      return;
    }
    ctx.wizard.state.offer = {propertyType};
    ctx.reply(`Which ownership type are you interested in?`,
      Markup.inlineKeyboard(
        ownershipTypes.map((type) =>
          Markup.button.callback(type, type)
        )
      )
    );
    return ctx.wizard.next();
  },
  (ctx) => {
    if (!ctx.callbackQuery || !ctx.callbackQuery.data) {
      ctx.reply(`Please select an ownership type using the buttons provided.`);
      return;
    }
    const ownershipType = ctx.callbackQuery.data.toUpperCase();
    if (!ownershipTypes.includes(ownershipType)) {
      ctx.reply(`Invalid input. Please choose either ${ownershipTypesString}.`);
      return;
    }
    ctx.wizard.state.offer.ownershipType = ownershipType;
    ctx.reply('Where is the property located? (Please provide the city without polish chars, like "Krakow")');
    return ctx.wizard.next();
  },
  (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply('Please provide a text message with the location.');
      return;
    }
    const localization = ctx.message.text;
    ctx.wizard.state.offer.localization = localization;

    const {propertyType, ownershipType} = ctx.wizard.state.offer;
    ctx.reply(`Summary of your requirements:
    - Property Type: ${propertyType}
    - Ownership Type: ${ownershipType}
    - Localization: ${localization}`);

    const chat_id = ctx.from.id;
    ctx.wizard.state.offer.chat_id = chat_id;

    // TODO: save in db

    ctx.reply('Thank you! Your offer requirements have been recorded.');
    return ctx.scene.leave();
  }
);