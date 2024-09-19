import {Prisma} from "@prisma/client";
import {getUserByTelegramChatId} from "./user.service";
import {findAllRequirements, upsertOfferRequirements} from "../database/offer-requirements.repository";
import {getOlxLocation} from "../scraper/olx/service";

export type CreateOfferRequirements = Omit<Prisma.OfferRequirementsCreateInput, "user" | "location">
  & { location: Omit<Prisma.LocationCreateWithoutOfferRequirementsInput, "normalized_name"> }

export const saveUserOfferRequirements = async (
  telegramChatId: number,
  offerRequirements: CreateOfferRequirements
) => {
  const user = await getUserByTelegramChatId(telegramChatId);
  const olxLocation = await getOlxLocation(offerRequirements.location.name);
  const location: Prisma.LocationCreateNestedOneWithoutOfferRequirementsInput = {
    create: {
      name: olxLocation.city.name,
      // use normalized name in OLX queries
      normalized_name: olxLocation.city.normalized_name,
      distance: offerRequirements.location.distance
    }
  }
  await upsertOfferRequirements(user.id, {
    ...offerRequirements,
    location,
  });
}

export const getAllUserOfferRequirements = async () => {
  return findAllRequirements();
}