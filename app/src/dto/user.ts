import {Prisma} from "@prisma/client";

export type UserDto = Prisma.UserCreateWithoutOfferRequirementsInput & { id: number }

export type DetailedUserDto = Prisma.UserGetPayload<{ include: { offerRequirements: { include: { location: true } } } }>

export type CreateUserDto = Prisma.UserCreateWithoutOfferRequirementsInput
