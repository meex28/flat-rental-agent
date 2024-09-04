import {getSingleOfferFromOlx, searchOffersOnOlx} from "../olx/service";
import {OlxSearchParams, RentOffer, RentOfferSummary} from "./types";
import {getSingleOfferFromOtodom} from "../otodom/service";
import {logger} from "../../utils/logger";

export const searchOffers = async (
  timestampFrom: number,
  city: string,
  searchParams: OlxSearchParams = {},
  queryText?: string
): Promise<RentOffer[]> => {
  logger.info(`Start searching offer in ${city} with search params: ${JSON.stringify(searchParams)}`);

  const offers = await searchOffersOnOlx(timestampFrom, city, searchParams, queryText);

  const { olxUrls, otodomUrls } = categorizeUrlsByPlatform(offers);

  logger.info(`Found ${olxUrls.length} OLX offers and ${otodomUrls.length} OTODOM offers. Total: ${olxUrls.length + otodomUrls.length}`);

  const detailedOffers = await Promise.all([
    ...olxUrls.map(getSingleOfferFromOlx),
    ...otodomUrls.map(getSingleOfferFromOtodom)
  ])
  return detailedOffers.filter(offer => offer != null);
}

const categorizeUrlsByPlatform = (offers: RentOfferSummary[]) => {
  const olxUrlsSet = new Set<string>();
  const otodomUrlsSet = new Set<string>();

  offers.forEach(offer => {
    if (offer.url.includes("otodom")) {
      if (!otodomUrlsSet.has(offer.url)) {
        otodomUrlsSet.add(offer.url);
      }
    } else {
      if (!olxUrlsSet.has(offer.url)) {
        olxUrlsSet.add(offer.url);
      }
    }
  });

  return {
    olxUrls: Array.from(olxUrlsSet),
    otodomUrls: Array.from(otodomUrlsSet)
  };
};
