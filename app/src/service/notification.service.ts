import {OfferSummary} from "../scraper/common/types";
import {logger} from "../utils/logger";
import {telegramBot} from "../telegram/init";
import {getUserById} from "./user.service";

export const sendOffersNotifications = async (offers: OfferSummary[], userId: number) => {
  logger.info(`Start sending notifications about ${offers.length} offers for user with id: ${userId}`);

  const user = await getUserById(userId);

  await Promise.all(
    offers.map(offer => sendTelegramNotification(user.telegram_chat_id, buildMessageAboutOffer(offer)))
  );
}

const buildMessageAboutOffer = (offer: OfferSummary) =>
  `🏠 New Property Offer Alert!\n` +
  `*Title:* ${offer.title}\n` +
  `📍 Location: ${offer.location}\n` +
  `💰 Price: ${offer.price} PLN\n` +
  `🌐 [View Offer](${offer.url})`

const sendTelegramNotification = async (telegramChatId: number, message: string) => {
  await telegramBot.api.sendMessage(telegramChatId, message, {parse_mode: "Markdown"})
}
