import puppeteer from 'puppeteer';

export const olxBaseUrl = "https://www.olx.pl";

export const visitOlxPage = async (url: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const fullUrl = `${olxBaseUrl}${url}`;
  await page.goto(fullUrl);

  return page;
}
