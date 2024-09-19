import {Prisma} from "@prisma/client";

export type UserDto = Prisma.UserCreateWithoutOfferRequirementsInput & { id: number }

export type CreateUserDto = Prisma.UserCreateWithoutOfferRequirementsInput
