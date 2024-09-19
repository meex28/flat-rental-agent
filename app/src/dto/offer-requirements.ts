import {Prisma} from "@prisma/client";
import {CreateLocationDto, LocationDto} from "./location";
import {UserDto} from "./user";

export type OfferRequirementsDto = Omit<Prisma.OfferRequirementsCreateInput, "user" | "location">
  & { location: LocationDto, id: number, user: UserDto };

export type CreateOfferRequirementsDto = Omit<OfferRequirementsDto, "location" | "user">
  & { location: CreateLocationDto };
