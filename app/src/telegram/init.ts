import {Telegraf} from "telegraf";
import {initializeTelegramCommands} from "./commands";

export let telegramBot: Telegraf;

export const launchTelegramBot = async () => {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  telegramBot = new Telegraf(telegramBotToken!!);

  initializeTelegramCommands(telegramBot);

  telegramBot.launch();
}
