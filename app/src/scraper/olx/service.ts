import {RentOffer, RentOfferSummary} from "../common/types";
import {parseOlxCreationDate, parseOlxPrice} from "./utils";
import {marketplacePlatformBaseUrls, visitPage} from "../common/client";

const olxBaseUrl = marketplacePlatformBaseUrls["OLX"];

export const searchOffersOnOlx = async (
  timestampFrom: number,
  city: string,
  searchParams: Record<string, string> = {},
  queryText?: string
): Promise<RentOfferSummary[]> => {
  const baseUrl = `/nieruchomosci/mieszkania/wynajem/${city}/`;
  const queryTextPart = queryText ? `q-${queryText}` : '';
  const orderSearchParams = {
    "order": "created_at:desc"
  }
  const searchParamsPart = Object.entries({...searchParams, ...orderSearchParams})
    .map(([key, value]) => `search[${key}]=${value}`)
    .join('&');
  const fullUrl = `${baseUrl}${queryTextPart}?${searchParamsPart}`;

  const numberOfPages = await fetchNumberOfPagesOnSearchUrl(fullUrl);

  const offers = await Promise.all(
    Array.from({ length: numberOfPages }, (_, i) => fetchOffersUrlsFromSinglePage(fullUrl, i + 1))
  );

  return offers.flat()
    .filter(offer => offer?.createdAt.getTime() > timestampFrom);
}

const fetchNumberOfPagesOnSearchUrl = async (url: string): Promise<number> => {
  const page = await visitPage(url, "OLX");
  const numberOfPages = await page.evaluate(() => {
    const pageElement = document.querySelectorAll('[data-testid="pagination-list-item"]');
    const numberOfPages = pageElement[pageElement.length - 1]?.textContent;
    if (!numberOfPages) {
      console.warn('could not find number of pages');
      return 1;
    }
    return parseInt(numberOfPages);
  });
  await page.close();
  return numberOfPages
}

const fetchOffersUrlsFromSinglePage = async (url: string, pageNumber: number): Promise<RentOfferSummary[]> => {
  const page = await visitPage(`${url}&page=${pageNumber}`, "OLX");
  const rawOffers = await page.evaluate(() => {
    const offers = document.querySelectorAll('[data-testid="l-card"]')
    return Array.from(offers).map((offer) => {
      const cardTitle = offer.querySelector('[data-cy="ad-card-title"]');
      const url = cardTitle?.querySelector('a')?.getAttribute('href');

      const locationAndDate = offer.querySelector('[data-testid="location-date"]');
      const [_, date] = locationAndDate?.textContent?.split(' - ') ?? [undefined, undefined];

      return { url, createdAt: date };
    });
  });
  await page.close();

  return rawOffers.filter(offer => !!offer.url && !!offer.createdAt)
    .map(offer => ({...offer, createdAt: parseOlxCreationDate(offer.createdAt!!)} as RentOfferSummary));
}

export const getSingleOfferFromOlx = async (url: string): Promise<RentOffer | null> => {
  const page = await visitPage(url, "OLX");

  const scrappedOffer = await page.evaluate(() => {
    const title = document.querySelector('[data-testid="ad_title"]')?.textContent;
    const price = document.querySelector('[data-testid="ad-price-container"]')?.textContent;
    const description = document.querySelector('[data-testid="ad_description"]')?.textContent;
    if (!title || !price || !description) {
      console.warn('could not find title, href or price');
      return null;
    }
    return {title, price, description};
  });
  await page.close();

  if (scrappedOffer == null) {
    return null;
  }

  return {
    ...scrappedOffer,
    id: 0,
    platform: "OLX",
    price: parseOlxPrice(scrappedOffer.price),
    url: `${olxBaseUrl}${url}`
  };
}