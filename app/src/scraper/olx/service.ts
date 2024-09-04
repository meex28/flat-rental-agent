import {OlxSearchParams, RentOffer, RentOfferSummary} from "../common/types";
import {parseOlxCreationDate, parseOlxPrice} from "./utils";
import {marketplacePlatformBaseUrls, visitPage} from "../common/client";
import {logger} from "../../utils/logger";

const olxBaseUrl = marketplacePlatformBaseUrls["OLX"];

export const searchOffersOnOlx = async (
  timestampFrom: number,
  city: string,
  searchParams: OlxSearchParams = {},
  queryText?: string
): Promise<RentOfferSummary[]> => {
  const baseUrl = `/nieruchomosci/mieszkania/wynajem/${city}/`;
  const queryTextPart = queryText ? `q-${queryText}` : '';
  const orderSearchParams = {
    "order": ["created_at:desc"]
  }
  const searchParamsPart = Object.entries({...searchParams, ...orderSearchParams})
    .map(([key, value]) => value.map(v => `search[${key}]=${v}`))
    .flat()
    .join('&');
  const fullUrl = `${baseUrl}${queryTextPart}?${searchParamsPart}`;

  const numberOfPages = await fetchNumberOfPagesOnSearchUrl(fullUrl);

  const offersPages: RentOfferSummary[][] = [];
  for(let i = 0; i < numberOfPages; i++) {
    const currentPageOffers = await fetchOffersUrlsFromSinglePage(fullUrl, i + 1);
    // if there are no offers in given time window on current page we stop loading
    // because we order them by creation date
    if (currentPageOffers.length === 0) {
      break;
    }
    offersPages.push(currentPageOffers);
  }

  return offersPages.flat().filter(offer => offer?.createdAt.getTime() > timestampFrom);
}

const fetchNumberOfPagesOnSearchUrl = async (url: string): Promise<number> => {
  const page = await visitPage(url, "OLX");
  const rawNumberOfPages = await page.evaluate(() => {
    const pageElement = document.querySelectorAll('[data-testid="pagination-list-item"]');
    return pageElement[pageElement.length - 1]?.textContent;
  });
  await page.close();
  if (!rawNumberOfPages) {
    logger.warn('Cannot find number of pages on URL: ' + url);
    return 1;
  }
  return Number.parseInt(rawNumberOfPages);
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