import {Prisma} from "@prisma/client";

export type LocationDto = Prisma.LocationCreateWithoutOfferRequirementsInput

export type CreateLocationDto = Omit<LocationDto, "normalized_name">