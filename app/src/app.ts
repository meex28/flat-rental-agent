import dotenv from 'dotenv';
import {launchTelegramBot} from "./notifications/telegram/bot";
import {initializeJobs} from "./jobs/service";

dotenv.config();

export const initializeApp = async () => {
  await launchTelegramBot();
  await initializeJobs();
}
