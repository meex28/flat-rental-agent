import {getSingleOfferFromOlx, searchOffersOnOlx} from "../olx/service";
import {RentOffer} from "./types";
import {getSingleOfferFromOtodom} from "../otodom/service";

export const searchOffers = async (
  timestampFrom: number,
  city: string,
  searchParams: Record<string, string> = {},
  queryText?: string
): Promise<RentOffer[]> => {
  const offers = await searchOffersOnOlx(timestampFrom, city, searchParams, queryText);
  const olxUrls = offers.filter(offer => !offer.url.includes("otodom")).map(offer => offer.url);
  const otodomUrls = offers.filter(offer => offer.url.includes("otodom")).map(offer => offer.url);

  const detailedOffers = await Promise.all([
    ...olxUrls.map(getSingleOfferFromOlx),
    ...otodomUrls.map(getSingleOfferFromOtodom)
  ])
  return detailedOffers.filter(offer => offer != null);
}