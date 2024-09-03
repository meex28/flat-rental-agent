import {sendTelegramNotification} from "../notifications/telegram/service";
import {searchOffers} from "../scraper/common/service";

export const runOfferNotificationJob = async () => {
  const searchParams = {
    "filter_enum_rooms": "four"
  }

  const now = new Date();
  const timestamp = now.getTime() - 5 * 3600 * 1000;
  const offers = await searchOffers(timestamp, "krakow", searchParams);

  const messages = offers.map(offer => `
    ${offer?.title}
    
    CENA: ${offer?.price}
    
    ${offer?.url}
  `)
  messages.forEach(sendTelegramNotification);
}