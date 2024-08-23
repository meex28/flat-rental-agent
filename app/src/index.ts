import {queryOlxOffers, fetchSingleFlatRentOffer} from "./scraper/service";

export const handler = async () => {
  const searchParams = {
    "filter_enum_rooms": "four",
    "order": "created_at:desc"
  }
  const offersUrls = await queryOlxOffers("krakow", searchParams);
  const detailedOffers = await Promise.all(
    offersUrls.slice(0, 5).map(url => fetchSingleFlatRentOffer(url))
  );
  detailedOffers.forEach(offer => console.log(offer?.title))
}

handler();