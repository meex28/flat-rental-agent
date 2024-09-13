import {sendTelegramNotification} from "../telegram/notifications";
import {searchOffers} from "../scraper/common/service";
import cron from 'node-cron';
import {closeCurrentBrowser} from "../scraper/common/client";
import {logger} from "../utils/logger";
import {getCurrentTimeInPoland} from "../utils/time";
import {OlxSearchParams} from "../scraper/common/types";

export const initializeJobs = async () => {
  const jobIntervalMinutes = Number(process.env.JOB_INTERVAL_MINUTES);
  cron.schedule(`*/${jobIntervalMinutes} * * * *`, async () => {
    await runOfferNotificationJob(jobIntervalMinutes);
  });
  // run job immediately on application init
  await runOfferNotificationJob(jobIntervalMinutes);
}

export const runOfferNotificationJob = async (jobIntervalMinutes: number) => {
  const searchParams: OlxSearchParams = {
    "filter_enum_rooms": ["three", "four"],
  }

  const polandNowTime = getCurrentTimeInPoland();
  const lastCheckTimestamp = polandNowTime.getTime() - jobIntervalMinutes * 60 * 1000;

  logger.info(`Start offer notification job. ` +
    `Current search params: ${JSON.stringify(searchParams)}. ` +
    `Time window (in UTC) ` +
    `from ${new Date(lastCheckTimestamp).toISOString()} ` +
    `to ${polandNowTime.toISOString()}`);

  const offers = await searchOffers(lastCheckTimestamp, "krakow", searchParams);

  await closeCurrentBrowser();

  logger.info(`Start sending notifications about ${offers.length} offers`);
  const messages = offers.map(offer => `
    ${offer?.title}
    
    CENA: ${offer?.price}
    
    ${offer?.url}
  `)
  messages.forEach(sendTelegramNotification);
}