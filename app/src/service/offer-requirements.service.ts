import {getUserByTelegramChatId} from "./user.service";
import {findAllRequirements, upsertOfferRequirements} from "../database/offer-requirements.repository";
import {getOlxLocation} from "../scraper/olx/service";
import {CreateOfferRequirementsDto} from "../dto/offer-requirements";
import {ObjectNotFoundError} from "../common/errors";

export const saveUserOfferRequirements = async (
  telegramChatId: number,
  offerRequirements: CreateOfferRequirementsDto
) => {
  const user = await getUserByTelegramChatId(telegramChatId);
  const olxLocation = await getOlxLocation(offerRequirements.location.name);
  const location = {
    name: olxLocation.city.name,
    // use normalized name in OLX queries
    normalized_name: olxLocation.city.normalized_name,
    distance: offerRequirements.location.distance
  }
  await upsertOfferRequirements({
    ...offerRequirements,
    user,
    location,
  });
}

export const getOfferRequirementsByTelegramChatId = async (telegramChatId: number) => {
  const user = await getUserByTelegramChatId(telegramChatId);

  if (user.offerRequirements?.length === 0) {
    throw new ObjectNotFoundError("User has no offer requirements")
  }

  return {
    ...user.offerRequirements[0],
    user
  };
}

export const getAllUserOfferRequirements = async () => {
  return findAllRequirements();
}