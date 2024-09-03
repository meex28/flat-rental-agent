import {sendTelegramNotification} from "../notifications/telegram/service";
import {searchOffers} from "../scraper/common/service";
import cron from 'node-cron';
import {closeCurrentBrowser} from "../scraper/common/client";

export const initializeJobs = async () => {
  const jobIntervalMinutes = 10;
  cron.schedule(`*/${jobIntervalMinutes} * * * *`, async () => {
    await runOfferNotificationJob(jobIntervalMinutes);
  });
  // run job immediately on application init
  await runOfferNotificationJob(jobIntervalMinutes);
}

export const runOfferNotificationJob = async (jobIntervalMinutes: number) => {
  const searchParams = {
    "filter_enum_rooms": "four"
  }

  const now = new Date();
  const lastCheckTimestamp = now.getTime() - jobIntervalMinutes * 60 * 1000;
  console.log("Run job at " + now);

  const offers = await searchOffers(lastCheckTimestamp, "krakow", searchParams);

  await closeCurrentBrowser();

  const messages = offers.map(offer => `
    ${offer?.title}
    
    CENA: ${offer?.price}
    
    ${offer?.url}
  `)
  messages.forEach(sendTelegramNotification);
}