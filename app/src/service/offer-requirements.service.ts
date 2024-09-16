import {Prisma} from "@prisma/client";
import {getUserByTelegramChatId} from "./user.service";
import {upsertOfferRequirements} from "../database/offer-requirements.repository";

export const saveUserOfferRequirements = async (telegramChatId: number, offerRequirements: Omit<Prisma.OfferRequirementsCreateInput, "user">) => {
  const user = await getUserByTelegramChatId(telegramChatId);
  await upsertOfferRequirements(user.id, offerRequirements);
}