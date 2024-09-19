import {getSingleOfferFromOlx, searchOffersOnOlx} from "../olx/service";
import {Offer, OfferSummary} from "./types";
import {getSingleOfferFromOtodom} from "../otodom/service";
import {logger} from "../../utils/logger";
import {OfferRequirementsDto} from "../../dto/offer-requirements";

export const searchOffers = async (
  timestampFrom: number,
  requirements: OfferRequirementsDto,
): Promise<Offer[]> => {
  logger.info(`Start searching offers for requirements: ${JSON.stringify(requirements)}`);

  const offers = await searchOffersOnOlx(timestampFrom, requirements);

  const { olxUrls, otodomUrls } = categorizeUrlsByPlatform(offers);

  logger.info(`Found ${olxUrls.length} OLX offers and ${otodomUrls.length} OTODOM offers. Total: ${olxUrls.length + otodomUrls.length}`);

  const detailedOffers = await Promise.all([
    ...olxUrls.map(getSingleOfferFromOlx),
    ...otodomUrls.map(getSingleOfferFromOtodom)
  ])
  return detailedOffers.filter(offer => offer != null);
}

const categorizeUrlsByPlatform = (offers: OfferSummary[]) => {
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
