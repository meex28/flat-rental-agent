import {session, Telegraf} from "telegraf";
import {initializeTelegramCommands} from "./commands";
import {initializeTelegramScenes} from "./scenes";
import {CustomTelegrafContext} from "./types";

export let telegramBot: Telegraf<CustomTelegrafContext>;

export const launchTelegramBot = async () => {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  telegramBot = new Telegraf(telegramBotToken!!);
  telegramBot.use(session());

  initializeTelegramScenes(telegramBot);
  await initializeTelegramCommands(telegramBot);

  telegramBot.launch();

  // Enable graceful stop
  process.once('SIGINT', () => telegramBot.stop('SIGINT'))
  process.once('SIGTERM', () => telegramBot.stop('SIGTERM'))
}
