import {prisma} from "./index";
import {Prisma, User} from "@prisma/client";

export const saveUser = async (user: Prisma.UserCreateInput) => {
  await prisma.user.create({
    data: user
  })
};

export const deleteUserByTelegramChatId = async (telegramChatId: number) => {
  await prisma.user.deleteMany({
    where: {
      telegram_chat_id: telegramChatId
    }
  })
};

export const getAllUsers = async (): Promise<User[]> => {
  return prisma.user.findMany();
};

export const userExistsByTelegramChatId = async (telegramChatId: number) => {
  return (await prisma.user.count({
    where: {
      telegram_chat_id: telegramChatId
    }
  })) > 0;
}