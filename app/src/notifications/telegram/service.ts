import {botSubscribedUsers, telegramBot} from "./bot";

export const sendTelegramNotification = (message: string) => {
  botSubscribedUsers.forEach(userId => {
    telegramBot.telegram.sendMessage(userId, message);
  });
}