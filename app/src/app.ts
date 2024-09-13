import dotenv from 'dotenv';
import {launchTelegramBot} from "./telegram/init";
import {initializeJobs} from "./jobs/service";

dotenv.config();

export const initializeApp = async () => {
  await launchTelegramBot();
  await initializeJobs();
}
