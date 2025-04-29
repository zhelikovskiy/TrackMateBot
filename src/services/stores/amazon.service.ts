import StoreInterface, { ItemWebData } from '../../interfaces/store.interface';
import puppeteerService from '../puppeteer.service';
import { PriceParsingError } from '../../errors';
import { Page } from 'puppeteer';

class AmazonService implements StoreInterface {
	async getProductData(url: string, store: string): Promise<any> {
		return await puppeteerService.queueTask(
			async (page: Page, url: string) => {
				await page.goto(url, { waitUntil: 'domcontentloaded' });

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
					throw new PriceParsingError(
						'Cannot get price for this item.'
					);
				}

				const currency = priceMatch[1]?.trim() || '';
				const price = parseFloat(priceMatch[2].replace(',', '.'));

				let oldPrice;

				await page
					.$eval(
						'.basisPrice .a-price.a-text-price .a-offscreen',
						(el) => el.textContent?.trim() || ''
					)
					.then((el) => {
						if (!el) return '0,00';
						else {
							const oldPriceMatch =
								el.match(/([^\d.,]+)?([\d.,]+)/);
							oldPrice = oldPriceMatch
								? parseFloat(oldPriceMatch[2].replace(',', '.'))
								: 0;
						}
					})
					.catch(() => {
						oldPrice = 0;
					});

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
