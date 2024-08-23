export type MarketplacePlatform = "OLX" | "OTODOM";

export interface RentOffer {
  id: number;
  title: string;
  price: number;
  description: string;
  url: string;
  platform: MarketplacePlatform;
}
