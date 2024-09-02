import {RentOffer} from "../common/types";
import {parseOlxPrice} from "./utils";
import {marketplacePlatformBaseUrls, visitPage} from "../common/client";

const olxBaseUrl = marketplacePlatformBaseUrls["OLX"];

export const searchOffersOnOlx = async (
  city: string,
  searchParams: Record<string, string> = {},
  queryText?: string
): Promise<string[]> => {
  const baseUrl = `/nieruchomosci/mieszkania/wynajem/${city}/`;
  const queryTextPart = queryText ? `q-${queryText}` : '';
  const searchParamsPart = Object.entries(searchParams)
    .map(([key, value]) => `search[${key}]=${value}`)
    .join('&');
  const fullUrl = `${baseUrl}${queryTextPart}?${searchParamsPart}`;

  const numberOfPages = await fetchNumberOfPagesOnSearchUrl(fullUrl);

  const urls = await Promise.all(
    Array.from({ length: numberOfPages }, (_, i) => fetchOffersUrlsFromSinglePage(fullUrl, i + 1))
  );

  return urls.flat();
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

const fetchOffersUrlsFromSinglePage = async (url: string, pageNumber: number): Promise<string[]> => {
  const page = await visitPage(`${url}&page=${pageNumber}`, "OLX");
  const urls = await page.evaluate(() => {
    const offers = document.querySelectorAll('[data-testid="l-card"]')
    return Array.from(offers).map((offer) => {
      const cardTitle = offer.querySelector('[data-cy="ad-card-title"]');
      return cardTitle?.querySelector('a')?.getAttribute('href');
    }).filter((o) => o != null);
  });
  await page.close();
  return urls;
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