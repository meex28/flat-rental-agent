import {prisma} from "../../database";
import {TelegramBotUser} from "@prisma/client";

export const saveTelegramBotUser = async (chatId: number) => {
  await prisma.telegramBotUser.create({
    data: {
      chat_id: chatId
    }
  })
};

export const deleteTelegramBotUser = async (chatId: number) => {
  await prisma.telegramBotUser.deleteMany({
    where: {
      chat_id: chatId
    }
  })
};

export const getAllTelegramBotUsers = async (): Promise<TelegramBotUser[]> => {
  return prisma.telegramBotUser.findMany();
};

export const telegramBotUserExists = async (chatId: number) => {
  return (await prisma.telegramBotUser.count({
    where: {
      chat_id: chatId
    }
  })) > 0;
}