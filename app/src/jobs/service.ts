import {sendTelegramNotification} from "../notifications/telegram/service";
import {searchOffers} from "../scraper/common/service";

export const runOfferNotificationJob = async () => {
  const searchParams = {
    "filter_enum_rooms": "four",
    "order": "created_at:desc"
  }
  const offers = await searchOffers("krakow", searchParams);
  offers.forEach(offer => console.log(offer?.title + " - " + offer?.platform))

  const messages = offers.map(offer => `
    ${offer?.title}
    
    CENA: ${offer?.price}
    
    ${offer?.url}
  `)
  messages.forEach(sendTelegramNotification);
}