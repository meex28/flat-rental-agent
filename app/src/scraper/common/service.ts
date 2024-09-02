import {getSingleOfferFromOlx, searchOffersOnOlx} from "../olx/service";
import {RentOffer} from "./types";
import {getSingleOfferFromOtodom} from "../otodom/service";

export const searchOffers = async (
  city: string,
  searchParams: Record<string, string> = {},
  queryText?: string
): Promise<RentOffer[]> => {
  const offersUrls = await searchOffersOnOlx(city, searchParams, queryText);
  // TODO: remove slice
  const olxUrls = offersUrls.filter(url => !url.includes("otodom")).slice(0, 3);
  const otodomUrls = offersUrls.filter(url => url.includes("otodom")).slice(0, 3);

  const offers = await Promise.all([
    ...olxUrls.map(getSingleOfferFromOlx),
    ...otodomUrls.map(getSingleOfferFromOtodom)
  ])
  return offers.filter(offer => offer != null);
}