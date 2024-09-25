import {OfferSummary} from "../scraper/common/types";
import {logger} from "../utils/logger";
import {getUserById} from "./user.service";
import {sendTelegramOfferAlert} from "../telegram/messages";

export const sendOffersNotifications = async (offers: OfferSummary[], userId: number) => {
  logger.info(`Start sending notifications about ${offers.length} offers for user with id: ${userId}`);

  const user = await getUserById(userId);

  await Promise.all(
    offers.map(offer => sendTelegramOfferAlert(offer, user.telegram_chat_id))
  );
}
