import {initializeTelegramCommands} from "./commands";
import {Bot, session} from "grammy";
import {AvailableConversations, BotContext} from "./types";
import {conversations, createConversation} from "@grammyjs/conversations";
import {setRequirementsConversation} from "./conversations/set-requirements";
import {I18n} from "@grammyjs/i18n";

export let telegramBot: Bot<BotContext>;

export const i18n = new I18n<BotContext>({
  defaultLocale: "en",
  useSession: true,
  directory: "src/telegram/locales",
  fluentBundleOptions: {useIsolating: false},
});

export const launchTelegramBot = async () => {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  telegramBot = new Bot(telegramBotToken!!);

  telegramBot.use(i18n);

  telegramBot.use(session({
    initial() {
      return {};
    }
  }));

  telegramBot.use(conversations());
  telegramBot.use(createConversation(setRequirementsConversation, AvailableConversations.SET_OFFER_REQUIREMENTS));

  await initializeTelegramCommands(telegramBot);

  telegramBot.start();

  // Enable graceful stop
  // TODO: why need to use double CTRL+C
  process.once('SIGINT', () => telegramBot.stop())
  process.once('SIGTERM', () => telegramBot.stop())
}
