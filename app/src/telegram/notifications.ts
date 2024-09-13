import {telegramBot} from "./init";
import {getAllUsers} from "../database/user.repository";

export const sendTelegramNotification = async (message: string) => {
  const subscribedUsers = await getAllUsers();
  subscribedUsers.forEach(user => {
    telegramBot.telegram.sendMessage(user.telegram_chat_id, message);
  });
}