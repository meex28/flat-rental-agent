import {Prisma} from "@prisma/client";
import {getUserByTelegramChatId} from "./user.service";
import {findAllRequirements, upsertOfferRequirements} from "../database/offer-requirements.repository";
import {getOlxLocation} from "../scraper/olx/service";

export const saveUserOfferRequirements = async (
  telegramChatId: number,
  offerRequirements: Omit<Prisma.OfferRequirementsCreateInput, "user" | "location_normalized_name">
) => {
  const user = await getUserByTelegramChatId(telegramChatId);
  const olxLocation = await getOlxLocation(offerRequirements.location);
  await upsertOfferRequirements(user.id, {
    ...offerRequirements,
    location: olxLocation.city.name,
    // use normalized name in OLX queries
    location_normalized_name: olxLocation.city.normalized_name
  });
}

export const getAllUserOfferRequirements = async () => {
  return findAllRequirements();
}