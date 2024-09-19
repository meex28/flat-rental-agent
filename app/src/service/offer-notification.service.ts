import {getAllUserOfferRequirements} from "./offer-requirements.service";
import {getCurrentTimeInPoland} from "../utils/time";
import {logger} from "../utils/logger";
import {searchOffers} from "../scraper/common/service";
import {sendOffersNotifications} from "./notification.service";
import {closeCurrentBrowser} from "../scraper/common/client";
import {OfferRequirementsDto} from "../dto/offer-requirements";

export const runOfferNotificationProcess = async (minutesInterval: number) => {
  const polandNowTime = getCurrentTimeInPoland();
  const lastCheckTimestamp = polandNowTime.getTime() - minutesInterval * 60 * 1000;
  logger.info(`Start notifying about offers from ${new Date(lastCheckTimestamp).toISOString()} to ${polandNowTime.toISOString()}`);
  const offerRequirements = await getAllUserOfferRequirements();
  await Promise.all(
    offerRequirements.map(requirement => runOfferNotificationProcessForSingleRequirements(lastCheckTimestamp, requirement))
  );
  await closeCurrentBrowser();
  logger.info(`Finished notifying about offers!`);
}

const runOfferNotificationProcessForSingleRequirements = async (lastCheckTimestamp: number, requirements: OfferRequirementsDto) => {
  logger.info(`Start notifying about offers for requirements: ${JSON.stringify(requirements)}`);
  const offers = await searchOffers(lastCheckTimestamp, requirements);
  await sendOffersNotifications(offers, requirements.user.id);
  logger.info(`Finished notifying about offers for requirements: ${JSON.stringify(requirements)}`);
}