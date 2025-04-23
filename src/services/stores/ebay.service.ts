import { Page } from 'puppeteer';
import StoreInterface, { ItemWebData } from '../../interfaces/store.interface';
import puppeteerService from '../puppeteer.service';

class EbayService implements StoreInterface {
	async getProductData(url: string, store: string): Promise<any> {
		return await puppeteerService.queueTask(async (page: Page, url: string) => {
			await page.goto(url, { waitUntil: 'domcontentloaded' });

			await page.waitForSelector('[data-testid="x-item-title"]', {
				timeout: 10000,
			});

			const title = await page.$eval(
				'[data-testid="x-item-title"] .x-item-title__mainTitle span',
				(el) => el.textContent?.trim() || ''
			);

			const priceString = await page.$eval(
				'[data-testid="x-price-primary"] span',
				(el) => el.textContent?.trim() || ''
			);

			const [currency, priceValue] = priceString.split(' ');
			const price = parseFloat(priceValue.replace(/\./g, '').replace(',', '.'));

			let oldPrice;

			await page
				.$eval(
					'[data-testid="x-price-transparency"] span .ux-textspans.ux-textspans--SECONDARY.ux-textspans--STRIKETHROUGH',
					(el) => el.textContent?.trim() || ''
				)
				.then((el) => {
					if (!el) return '0,00';
					else
						oldPrice = parseFloat(
							el.split(' ')[1].replace(/\./g, '').replace(',', '.')
						);
				})
				.catch(() => {
					oldPrice = 0;
				});

			await page.close();

			const itemInfo: ItemWebData = {
				price: price,
				title: title,
				store: store,
				currency: currency,
				oldPrice: oldPrice,
			};

			return itemInfo;
		}, url);
	}
}

export default new EbayService();
