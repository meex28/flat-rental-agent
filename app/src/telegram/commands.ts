import {Telegraf} from "telegraf";
import {saveUser, userExistsByTelegramChatId} from "../database/user.repository";
import {AvailableScenes, CustomTelegrafContext} from "./types";

export const initializeTelegramCommands = (telegramBot: Telegraf<CustomTelegrafContext>) => {
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

  telegramBot.command("set_requirements", (ctx) => {
    ctx.scene.enter(AvailableScenes.CREATE_OFFER_REQUIREMENTS);
  })
}
