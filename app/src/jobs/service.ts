import cron from 'node-cron';
import {runOfferNotificationProcess} from "../service/offer-notification.service";

export const initializeJobs = async () => {
  const jobIntervalMinutes = Number(process.env.JOB_INTERVAL_MINUTES);
  cron.schedule(`*/${jobIntervalMinutes} * * * *`, async () => {
    await runOfferNotificationProcess(jobIntervalMinutes);
  });
  // run job immediately on application init
  await runOfferNotificationProcess(jobIntervalMinutes);
}
