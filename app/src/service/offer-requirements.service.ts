import {Prisma} from "@prisma/client";
import {getUserByTelegramChatId} from "./user.service";
import {findAllRequirements, upsertOfferRequirements} from "../database/offer-requirements.repository";

export const saveUserOfferRequirements = async (telegramChatId: number, offerRequirements: Omit<Prisma.OfferRequirementsCreateInput, "user">) => {
  const user = await getUserByTelegramChatId(telegramChatId);
  await upsertOfferRequirements(user.id, offerRequirements);
}

export const getAllUserOfferRequirements = async () => {
  return findAllRequirements();
}