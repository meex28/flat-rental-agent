import {ObjectNotFoundError} from "../common/errors";
import {User} from "@prisma/client";
import {findUserByTelegramChatId, saveUser, userExistsByTelegramChatId} from "../database/user.repository";
import {prisma} from "../database";
import {DetailedUserDto} from "../dto/user";

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

export const getUserByTelegramChatId = async (telegramChatId: number): Promise<DetailedUserDto> => {
  const user = await findUserByTelegramChatId(telegramChatId);
  if (!user) {
    throw new ObjectNotFoundError(`User for telegram chat id ${telegramChatId} not found.`)
  }
  return user;
}

/**
 * Runs when user subscribes to notifications on telegram channel
 *
 * @return - true if user already subscribed, false otherwise
 */
export const onUserTelegramSubscription = async (telegramChatId: number): Promise<boolean> => {
  const userAlreadySubscribed = await userExistsByTelegramChatId(telegramChatId);

  if (!userAlreadySubscribed) {
    await saveUser({telegram_chat_id: telegramChatId});
    return false;
  }

  return true;
}