import {marketplacePlatformBaseUrls} from "../common/client";
import {OlxLocationAutocompleteResponse} from "./types";

const olxBaseUrl = marketplacePlatformBaseUrls["OLX"];

export const fetchLocationAutocomplete = async (query: string): Promise<OlxLocationAutocompleteResponse> => fetch(
  `${olxBaseUrl}/api/v1/geo-encoder/location-autocomplete/?query=${query}`
).then(response => response.json());
