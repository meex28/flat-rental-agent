export type MarketplacePlatform = "OLX" | "OTODOM";

export interface RentOfferSummary {
  url: string;
  createdAt: Date;
}

export interface RentOffer {
  id: number;
  title: string;
  price: number;
  description: string;
  url: string;
  platform: MarketplacePlatform;
}

export type OlxSearchParams = Record<string, string[]>
