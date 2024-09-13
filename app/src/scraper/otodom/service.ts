import {Offer} from "../common/types";
import {marketplacePlatformBaseUrls, visitPage} from "../common/client";
import {parseOtodomPrice} from "./utils";

const otodomBaseUrl = marketplacePlatformBaseUrls["OTODOM"];

export const getSingleOfferFromOtodom = async (url: string): Promise<Offer | null> => {
  const page = await visitPage(url, "OTODOM");
  const scrappedOffer = await page.evaluate(() => {
    const title = document.querySelector('[data-cy="adPageAdTitle"]')?.textContent;
    const basePrice = document.querySelector('[data-cy="adPageHeaderPrice"]')?.textContent;
    const description = document.querySelector('[data-cy="adPageAdDescription"]')?.textContent;
    return {title, basePrice, description};
  });
  await page.close();

  if (!scrappedOffer.title || !scrappedOffer.basePrice || !scrappedOffer.description) {
    console.warn(`could not find title (value: ${scrappedOffer.title}), description (value: ${scrappedOffer.description}) or price (value: ${scrappedOffer.basePrice})`);
    return null;
  }

  return {
    ...scrappedOffer,
    url: `${otodomBaseUrl}${url.replace(otodomBaseUrl, '')}`,
    platform: "OTODOM",
    price: parseOtodomPrice(scrappedOffer.basePrice),
    id: 0 // TODO: include ID
  } as Offer
}