import {Telegraf} from "telegraf";
import {saveUser, userExistsByTelegramChatId} from "../database/user.repository";
import {AvailableCommands, AvailableScenes, CustomTelegrafContext} from "./types";

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
    const userAlreadySubscribed = await userExistsByTelegramChatId(chatId);

    if(userAlreadySubscribed) {
      await ctx.reply('You are already on the notification list!')
    } else {
      await saveUser({ telegram_chat_id: chatId });
      await ctx.reply('You have been added to the notification list!')
    }
  });

  telegramBot.command(AvailableCommands.SET_REQUIREMENTS, (ctx) => {
    ctx.scene.enter(AvailableScenes.CREATE_OFFER_REQUIREMENTS);
  })
}
