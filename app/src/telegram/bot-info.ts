import {BotContext} from "./types";
import {Bot} from "grammy";
import {i18n} from "./init";

export const initializeBotInfo = async (telegramBot: Bot<BotContext>) => {
  await telegramBot.api.setMyDescription(i18n.t("en", "bot-info-description"));
  await telegramBot.api.setMyShortDescription(i18n.t("en", "bot-info-short-description"));
}