import {Telegraf} from "telegraf";
import {saveTelegramBotUser, telegramBotUserExists} from "./repository";

export let telegramBot: Telegraf;

export const launchTelegramBot = async () => {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  telegramBot = new Telegraf(telegramBotToken!!);

  telegramBot.start(async (ctx) => {
    const chatId = ctx.from.id;
    const userAlreadySubscribed = await telegramBotUserExists(chatId);

    if(userAlreadySubscribed) {
      ctx.reply('You are already on the notification list!')
    } else {
      saveTelegramBotUser(chatId);
      ctx.reply('You have been added to the notification list!')
    }
  });

  telegramBot.launch();
}
