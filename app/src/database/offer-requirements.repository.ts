import {prisma} from "./index";
import {OfferRequirementsDto} from "../dto/offer-requirements";

export const upsertOfferRequirements = async (
  data: OfferRequirementsDto
) => {
  const dataToSave = {...data, user: undefined}
  return prisma.offerRequirements.upsert({
    where: {
      userId: data.user.id,
    },
    update: {
      ...dataToSave,
      location: data.location
        ? {
          upsert: {
            create: {...data.location},
            update: {...data.location},
          },
        }
        : undefined
    },
    create: {
      ...dataToSave,
      userId: data.user.id,
      location: data.location
        ? {
          create: {...data.location},
        }
        : undefined,
    },
    include: {
      location: true,
    }
  });
};

export const findAllRequirements = (): Promise<OfferRequirementsDto[]> =>
  prisma.offerRequirements.findMany({include: {location: true, user: true}}) as Promise<OfferRequirementsDto[]>;

export const findRequirementsByUserId = (userId: number): Promise<OfferRequirementsDto | null> =>
  prisma.offerRequirements.findFirst({
    where: {userId},
    include: {location: true, user: true}
  }) as Promise<OfferRequirementsDto | null>;