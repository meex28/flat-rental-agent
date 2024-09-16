import {ObjectNotFoundError} from "../common/errors";
import {User} from "@prisma/client";
import {findUserByTelegramChatId} from "../database/user.repository";

export const getUserByTelegramChatId = async (telegramChatId: number): Promise<User> => {
  const user = await findUserByTelegramChatId(telegramChatId);
  if (!user) {
    throw new ObjectNotFoundError(`User for telegram chat id ${telegramChatId} not found.`)
  }
  return user;
}