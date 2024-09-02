import puppeteer, {GoToOptions, Page, PuppeteerLaunchOptions} from 'puppeteer';
import {MarketplacePlatform} from "./types";

export const marketplacePlatformBaseUrls: Record<MarketplacePlatform, string> = {
  OLX: "https://www.olx.pl",
  OTODOM: "https://www.otodom.pl"
}

export const visitPage = async (url: string, platform: MarketplacePlatform, launchOptions: PuppeteerLaunchOptions = {}, gotoOptions: GoToOptions = {}) => {
  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  const userAgent =
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";
  await page.setUserAgent(userAgent);

  const baseUrl = marketplacePlatformBaseUrls[platform];
  const fullUrl = `${baseUrl}${url.replace(baseUrl, '')}`;
  await page.goto(fullUrl, gotoOptions);

  return page;
}
