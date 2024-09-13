export type MarketplacePlatform = "OLX" | "OTODOM";

export interface OfferSummary {
  url: string;
  createdAt: Date;
}

export interface Offer {
  id: number;
  title: string;
  price: number;
  description: string;
  url: string;
  platform: MarketplacePlatform;
}

export type OlxSearchParams = Record<string, string[]>
