import {prisma} from "./index";
import {User} from "@prisma/client";
import {CreateUserDto, DetailedUserDto} from "../dto/user";

export const saveUser = async (user: CreateUserDto) => {
  await prisma.user.create({
    data: user
  })
};

export const getAllUsers = async (): Promise<User[]> => {
  return prisma.user.findMany();
};

export const findUserByTelegramChatId = async (telegramChatId: number): Promise<DetailedUserDto | null> => {
  return prisma.user.findFirst({
    where: {
      telegram_chat_id: telegramChatId
    },
    include: {offerRequirements: {include: {location: true}}}
  });
}

export const userExistsByTelegramChatId = async (telegramChatId: number) => {
  return (await prisma.user.count({
    where: {
      telegram_chat_id: telegramChatId
    }
  })) > 0;
}
