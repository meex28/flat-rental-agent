import dotenv from 'dotenv';
import {launchTelegramBot} from "./notifications/telegram/bot";

dotenv.config();

export const initializeApp = async () => {
  await launchTelegramBot();
}
