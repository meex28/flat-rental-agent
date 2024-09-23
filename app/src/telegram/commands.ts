import {AvailableCommands, AvailableConversations, BotContext} from "./types";
import {onUserTelegramSubscription} from "../service/user.service";
import {Bot} from "grammy";

const commandsDescriptions: Record<AvailableCommands, string> = {
  start: "Start receiving notifications",
  set_requirements: "Set requirements of offers that you want to receive notifications",
}

export const initializeTelegramCommands = async (telegramBot: Bot<BotContext>) => {
  await telegramBot.api.setMyCommands(
    Object.entries(commandsDescriptions).map(([command, description]) => ({command, description}))
  );

  telegramBot.command(AvailableCommands.START, async (ctx) => {
    const chat = await ctx.getChat();
    const chatId = chat.id;
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

  telegramBot.command(AvailableCommands.SET_REQUIREMENTS, async (ctx) => {
    await ctx.conversation.enter(AvailableConversations.SET_OFFER_REQUIREMENTS);
  })
}
