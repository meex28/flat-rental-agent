import {queryOlxOffers, fetchSingleFlatRentOffer} from "./scraper/service";

export const handler = async () => {
  const offersUrls = await queryOlxOffers("krakow", "mieszkanie do wynajecia");
  const detailedOffers = await Promise.all(
    offersUrls.slice(0, 5).map(url => fetchSingleFlatRentOffer(url))
  );
  detailedOffers.forEach(offer => console.log(JSON.stringify(offer)))
}

handler();