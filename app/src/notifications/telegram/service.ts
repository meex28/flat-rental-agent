import {telegramBot} from "./bot";
import {getAllTelegramBotUsers} from "./repository";

export const sendTelegramNotification = async (message: string) => {
  const subscribedUsers = await getAllTelegramBotUsers();
  subscribedUsers.forEach(user => {
    telegramBot.telegram.sendMessage(user.chat_id, message);
  });
}