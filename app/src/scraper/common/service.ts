import {searchOffersOnOlx} from "../olx/service";
import {MarketplacePlatform, OfferSummary} from "./types";
import {logger} from "../../utils/logger";
import {OfferRequirementsDto} from "../../dto/offer-requirements";

export const searchOffers = async (
  timestampFrom: number,
  requirements: OfferRequirementsDto,
): Promise<OfferSummary[]> => {
  logger.info(`Start searching offers for requirements: ${JSON.stringify(requirements)}`);
  const offers = await searchOffersOnOlx(timestampFrom, requirements);
  const olxOffersNumber = offers.filter(o => o.platform === "OLX").length;
  const otodomOffersNumber = offers.filter(o => o.platform === "OTODOM").length;
  logger.info(`Found ${olxOffersNumber} OLX offers and ${otodomOffersNumber} OTODOM offers. Total: ${olxOffersNumber + otodomOffersNumber}`);
  return offers;
}

export const getMarketplacePlatformFromUrl = (url: string): MarketplacePlatform =>
  url.includes("otodom") ? "OTODOM" : "OLX";