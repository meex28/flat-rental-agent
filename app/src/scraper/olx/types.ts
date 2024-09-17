export interface OlxCity {
  id: number;
  name: string;
  normalized_name: string;
  lat: number;
  lon: number;
}

export interface OlxMunicipality {
  name: string;
}

export interface OlxCounty {
  name: string;
}

export interface OlxRegion {
  id: number;
  name: string;
  normalized_name: string;
}

export interface OlxLocation {
  city: OlxCity;
  municipality: OlxMunicipality;
  county: OlxCounty;
  region: OlxRegion;
}

export interface OlxLocationAutocompleteResponse {
  data: OlxLocation[];
}