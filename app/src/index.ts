import {initializeApp} from "./app";
import {runOfferNotificationJob} from "./jobs/service";

const handler = async () => {
  await initializeApp();
  await runOfferNotificationJob();
}
handler();
