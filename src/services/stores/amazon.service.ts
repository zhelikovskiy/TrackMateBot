import StoreInterface, { ItemWebData } from '../../interfaces/store.interface';
import puppeteerService from '../puppeteer.service';
import { PriceParsingError } from '../../errors';
import { Page } from 'puppeteer';

class AmazonService implements StoreInterface {
	async getProductData(url: string, store: string): Promise<any> {
		return await puppeteerService.executeTask(
			async (page: Page, url: string) => {
				await page.goto(url, { waitUntil: 'networkidle2' });

				const title = await page.$eval(
					'#productTitle',
					(el) => el.textContent?.trim() || ''
				);

				const priceStr = await page.$eval(
					'.a-price .a-offscreen',
					(el) => el.textContent?.trim() || ''
				);
				const priceMatch = priceStr.match(/([^\d.,]+)?([\d.,]+)/);
				if (!priceMatch) {
					throw new PriceParsingError('Cannot get price for this item.');
				}

				const currency = priceMatch[1]?.trim() || '';
				const price = parseFloat(priceMatch[2].replace(',', '.'));

				const oldPriceStr = await page.$eval(
					'.basisPrice .a-price.a-text-price .a-offscreen',
					(el) => el.textContent?.trim() || ''
				);

				const oldPriceMatch = oldPriceStr.match(/([^\d.,]+)?([\d.,]+)/);
				let oldPrice = oldPriceMatch
					? parseFloat(oldPriceMatch[2].replace(',', '.'))
					: 0;
				if (oldPrice == price) oldPrice = 0;

				const itemInfo: ItemWebData = {
					price: price,
					title: title,
					store: store,
					currency: currency,
					oldPrice: oldPrice,
				};

				return itemInfo;
			},
			url
		);
	}
}

export default new AmazonService();
