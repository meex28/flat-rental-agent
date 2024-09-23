import {Telegraf} from "telegraf";
import {AvailableCommands, AvailableScenes, CustomTelegrafContext} from "./types";
import {onUserTelegramSubscription} from "../service/user.service";

const commandsDescriptions: Record<AvailableCommands, string> = {
  start: "Start receiving notifications",
  set_requirements: "Set requirements of offers that you want to receive notifications",
}

export const initializeTelegramCommands = async (telegramBot: Telegraf<CustomTelegrafContext>) => {
  await telegramBot.telegram.setMyCommands(
    Object.entries(commandsDescriptions).map(([command, description]) => ({command, description}))
  );

  telegramBot.start(async (ctx) => {
    const chatId = ctx.from.id;
    const hasUserAlreadySubscribed = await onUserTelegramSubscription(chatId);

    const welcomeMessage =
      "🏠 Welcome to FlatRentalAgent! I'm here to help you discover your ideal place.\n\n" +
      "To get started, please tell me about your dream property using the " +
      `/${AvailableCommands.SET_REQUIREMENTS} command. Once you've set your preferences, ` +
      "I'll keep an eye out and notify you whenever I find matching properties.\n\n" +
      "Happy house hunting! 🔍🏡";

    const alreadySubscribedMessage =
      "Welcome back! 👋 It's great to see you again.\n\n" +
      "I'm still actively searching for properties that match your requirements. " +
      "If you'd like to update your preferences, just use the " +
      `/${AvailableCommands.SET_REQUIREMENTS} command.\n\n`;

    await ctx.reply(hasUserAlreadySubscribed ? alreadySubscribedMessage : welcomeMessage);
  });

  telegramBot.command(AvailableCommands.SET_REQUIREMENTS, (ctx) => {
    ctx.scene.enter(AvailableScenes.CREATE_OFFER_REQUIREMENTS);
  })
}
