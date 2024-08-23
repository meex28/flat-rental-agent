import puppeteer from 'puppeteer';
import {MarketplacePlatform} from "./types";

export const marketplacePlatformBaseUrls: Record<MarketplacePlatform, string> = {
  OLX: "https://www.olx.pl",
  OTODOM: "https://www.otodom.pl"
}

export const visitPage = async (url: string, platform: MarketplacePlatform) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const baseUrl = marketplacePlatformBaseUrls[platform];
  const fullUrl = `${baseUrl}${url}`;
  await page.goto(fullUrl);
  return page;
}
