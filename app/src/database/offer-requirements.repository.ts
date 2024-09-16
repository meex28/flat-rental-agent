import {Prisma} from "@prisma/client";
import {prisma} from "./index";

export const upsertOfferRequirements = (
  userId: number,
  data: Omit<Prisma.OfferRequirementsCreateInput, 'user'>
) => {
  return prisma.offerRequirements.upsert({
    where: {
      userId,
    },
    update: data,
    create: {...data, user: {connect: {id: userId}}},
  })
}
