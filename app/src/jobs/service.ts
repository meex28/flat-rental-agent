import {fetchSingleFlatRentOffer, searchOlxOffers} from "../scraper/service";
import {sendTelegramNotification} from "../notifications/telegram/service";

export const runOfferNotificationJob = async () => {
  const searchParams = {
    "filter_enum_rooms": "four",
    "order": "created_at:desc"
  }
  const offersUrls = await searchOlxOffers("krakow", searchParams);
  const detailedOffers = await Promise.all(
    offersUrls.slice(0, 5).map(url => fetchSingleFlatRentOffer(url))
  );
  detailedOffers.forEach(offer => console.log(offer?.title))

  const messages = detailedOffers.map(offer => `
    ${offer?.title}
    
    CENA: ${offer?.price}
    
    ${offer?.url}
  `)
  messages.forEach(sendTelegramNotification);
}