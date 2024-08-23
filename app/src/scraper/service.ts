import {visitOlxPage} from "./client";
import {OlxOffer} from "./model";
import {parseOlxPrice} from "./utils";

export const searchOlxOffers = async (
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
    Array.from({ length: numberOfPages }, (_, i) => searchOlxOffersSinglePage(fullUrl, i + 1))
  );

  return urls.flat();
}

export const fetchNumberOfPagesOnSearchUrl = async (url: string): Promise<number> => {
  const page = await visitOlxPage(url);
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

export const searchOlxOffersSinglePage = async (url: string, pageNumber: number): Promise<string[]> => {
  const page = await visitOlxPage(`${url}&page=${pageNumber}`);
  const urls = await page.evaluate(() => {
    const offers = document.querySelectorAll('[data-testid="l-card"]')
    return Array.from(offers).map((offer) => {
      const cardTitle = offer.querySelector('[data-cy="ad-card-title"]');
      return cardTitle?.querySelector('a')?.getAttribute('href');
    }).filter((o) => o != null);
  });
  await page.close();
  return urls.filter((url) => !url.includes('otodom'));
}

export const fetchSingleFlatRentOffer = async (url: string): Promise<OlxOffer | null> => {
  const page = await visitOlxPage(url);

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
    price: parseOlxPrice(scrappedOffer.price),
    href: url
  };
}