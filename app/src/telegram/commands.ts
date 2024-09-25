import {AvailableCommands, AvailableConversations, BotContext} from "./types";
import {onUserTelegramSubscription} from "../service/user.service";
import {Bot} from "grammy";
import {generateRequirementsSummary} from "./conversations/set-requirements";
import {getOfferRequirementsByTelegramChatId} from "../service/offer-requirements.service";
import {ObjectNotFoundError} from "../common/errors";

const commandsDescriptions: Record<AvailableCommands, string> = {
  start: "Start receiving notifications",
  set_requirements: "Set requirements of offers that you want to receive notifications",
  show_requirements: "Show active requirements of offers that you want to receive notifications",
  help: "Show help message about this bot",
  author: "Show information about the author of this bot"
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

  telegramBot.command(AvailableCommands.HELP, async (ctx) => {
    await ctx.reply(ctx.t("help-message"));
  })

  telegramBot.command(AvailableCommands.AUTHOR, async (ctx) => {
    await ctx.replyWithMarkdown(ctx.t("author-message"));
  });

  telegramBot.command(AvailableCommands.SET_REQUIREMENTS, async (ctx) => {
    await ctx.conversation.enter(AvailableConversations.SET_OFFER_REQUIREMENTS);
  })

  telegramBot.command(AvailableCommands.SHOW_REQUIREMENTS, async (ctx) => {
    const chat = await ctx.getChat();
    const chatId = chat.id;
    try {
      const requirements = await getOfferRequirementsByTelegramChatId(chatId);
      await ctx.reply(generateRequirementsSummary(ctx, {...requirements, location: requirements.location!!}));
    } catch (e) {
      if (e instanceof ObjectNotFoundError) {
        await ctx.reply(ctx.t("show-requirement-not-found"))
      } else {
        throw e;
      }
    }
  })
}
