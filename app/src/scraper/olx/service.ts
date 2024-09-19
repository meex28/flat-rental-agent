import {Offer, OfferSummary, OlxSearchParams} from "../common/types";
import {parseOlxCreationDate, parseOlxPrice} from "./utils";
import {marketplacePlatformBaseUrls, visitPage} from "../common/client";
import {logger} from "../../utils/logger";
import {ownershipTypeUrlMappings, propertyTypeUrlMappings} from "./mappings";
import {fetchLocationAutocomplete} from "./api";
import {InternalServerError, ObjectNotFoundError} from "../../common/errors";
import {OlxLocation} from "./types";
import {OfferRequirementsDto} from "../../dto/offer-requirements";

const olxBaseUrl = marketplacePlatformBaseUrls["OLX"];

export const searchOffersOnOlx = async (
  timestampFrom: number,
  requirements: OfferRequirementsDto,
): Promise<OfferSummary[]> => {
  const url = buildSearchUrl(requirements);

  const numberOfPages = await fetchNumberOfPagesOnSearchUrl(url);

  const offersPages: OfferSummary[][] = [];
  for (let i = 0; i < numberOfPages; i++) {
    const currentPageOffers = await fetchOffersUrlsFromSinglePage(url, i + 1);
    // if there are no offers in given time window on current page we stop loading
    // because we order them by creation date
    if (currentPageOffers.length === 0) {
      break;
    }
    offersPages.push(currentPageOffers);
  }

  return offersPages.flat().filter(offer => offer?.createdAt.getTime() > timestampFrom);
}

const buildSearchUrl = (requirements: OfferRequirementsDto) => {
  const baseUrl = `/nieruchomosci` +
    `/${propertyTypeUrlMappings[requirements.propertyType]}` +
    `/${ownershipTypeUrlMappings[requirements.ownershipType]}` +
    `/${requirements.location!!.normalized_name}/`;

  const orderSearchParams = {
    "order": ["created_at:desc"]
  }

  const filterSearchParams = buildFilterSearchParams(requirements);

  const searchParamsPart = Object.entries({...orderSearchParams, ...filterSearchParams})
    .map(([key, value]) => value.map(v => `search[${key}]=${v}`))
    .flat()
    .join('&');

  return `${baseUrl}?${searchParamsPart}`;
}

const buildFilterSearchParams = (requirements: OfferRequirementsDto): OlxSearchParams => {
  // some params are passed as query params and some as path variables
  type OlxParamsPassedInQuery = Pick<
    OfferRequirementsDto,
    "minSize" | "maxSize" | "minPrice" | "maxPrice"
  >;
  const olxParamsKeys: Record<keyof OlxParamsPassedInQuery, string> = {
    minPrice: "filter_float_price:from",
    maxPrice: "filter_float_price:to",
    minSize: "filter_float_m:from",
    maxSize: "filter_float_m:to"
  }
  return Object.entries(olxParamsKeys)
    .reduce(
      (acc, [requirementsKey, olxKey]) => {
        const value = requirements[requirementsKey as keyof OfferRequirementsDto];
        if (value == undefined) return acc;
        return {...acc, [olxKey]: [requirements[requirementsKey as keyof OfferRequirementsDto]]};
      },
      {}
    );
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

const fetchOffersUrlsFromSinglePage = async (url: string, pageNumber: number): Promise<OfferSummary[]> => {
  const page = await visitPage(`${url}&page=${pageNumber}`, "OLX");
  const rawOffers = await page.evaluate(() => {
    const offers = document.querySelectorAll('[data-testid="l-card"]')
    return Array.from(offers).map((offer) => {
      const cardTitle = offer.querySelector('[data-cy="ad-card-title"]');
      const url = cardTitle?.querySelector('a')?.getAttribute('href');

      const locationAndDate = offer.querySelector('[data-testid="location-date"]');
      const [_, date] = locationAndDate?.textContent?.split(' - ') ?? [undefined, undefined];

      return {url, createdAt: date};
    });
  });
  await page.close();

  return rawOffers.filter(offer => !!offer.url && !!offer.createdAt)
    .map(offer => ({...offer, createdAt: parseOlxCreationDate(offer.createdAt!!)} as OfferSummary));
}

export const getSingleOfferFromOlx = async (url: string): Promise<Offer | null> => {
  const page = await visitPage(url, "OLX");

  const scrappedOffer = await page.evaluate(() => {
    const title = document.querySelector('[data-testid="ad_title"]')?.textContent;
    const price = document.querySelector('[data-testid="ad-price-container"]')?.textContent;
    const description = document.querySelector('[data-testid="ad_description"]')?.textContent;
    const footer = document.querySelector('[data-cy="ad-footer-bar-section"]');
    const id = footer ? footer.children[0].textContent?.replace("ID: ", "") : undefined;

    if (!title || !price || !description || !id) {
      return null;
    }

    return {id, title, price, description};
  });
  await page.close();

  if (scrappedOffer == null) {
    return null;
  }

  return {
    ...scrappedOffer,
    id: Number(scrappedOffer.id),
    platform: "OLX",
    price: parseOlxPrice(scrappedOffer.price),
    url: `${olxBaseUrl}${url}`
  };
}

/**
 * Fetches the OLX location based on the provided query. Powered by OLX location autocomplete from main page.
 *
 * @param {string} query - The query string to search for the location.
 * @returns {Promise<OlxLocation>} - The first location data from the response.
 * @throws {InternalServerError} If there is an error fetching location autocomplete from OLX.
 * @throws {ObjectNotFoundError} If no locations are found for the given query.
 */
export const getOlxLocation = async (query: string): Promise<OlxLocation> => {
  let response;
  try {
    response = await fetchLocationAutocomplete(query);
  } catch (err) {
    throw new InternalServerError(`Cannot fetch location autocomplete from OLX! Err: ${JSON.stringify(err)}`);
  }
  if (response.data.length === 0) {
    throw new ObjectNotFoundError(`No locations found for query: ${query}`);
  }
  return response.data[0];
}