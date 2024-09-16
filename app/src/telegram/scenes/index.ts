import {createOfferRequirements} from "./create-offer-requirements";
import {Scenes, Telegraf} from "telegraf";
import {CustomTelegrafContext} from "../types";

export const initializeTelegramScenes = (telegramBot:  Telegraf<CustomTelegrafContext>) => {
  const stage = new Scenes.Stage([createOfferRequirements]);
  telegramBot.use(stage.middleware());
}