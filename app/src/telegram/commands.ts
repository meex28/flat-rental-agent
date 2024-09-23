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
    const response = ctx.t(hasUserAlreadySubscribed ? "start-message-already-subscribed" : "start-message");
    await ctx.reply(response);
  });

  telegramBot.command(AvailableCommands.SET_REQUIREMENTS, async (ctx) => {
    await ctx.conversation.enter(AvailableConversations.SET_OFFER_REQUIREMENTS);
  })
}
