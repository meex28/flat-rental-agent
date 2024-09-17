import {ObjectNotFoundError} from "../common/errors";
import {User} from "@prisma/client";
import {findUserByTelegramChatId} from "../database/user.repository";
import {prisma} from "../database";

export const getUserById = async (id: number): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  });
  if (!user) {
    throw new ObjectNotFoundError(`User with id ${id} not found.`)
  }
  return user;
}

export const getUserByTelegramChatId = async (telegramChatId: number): Promise<User> => {
  const user = await findUserByTelegramChatId(telegramChatId);
  if (!user) {
    throw new ObjectNotFoundError(`User for telegram chat id ${telegramChatId} not found.`)
  }
  return user;
}