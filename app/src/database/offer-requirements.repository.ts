import {Prisma} from "@prisma/client";
import {prisma} from "./index";

export const saveOfferRequirements = async (offerRequirements: Prisma.OfferRequirementsCreateInput) => {
  return prisma.offerRequirements.create({data: offerRequirements});
}