import { Page } from 'puppeteer';
import StoreInterface, { ItemWebData } from '../../interfaces/store.interface';
import puppeteerService from '../puppeteer.service';

class EbayService implements StoreInterface {
	async getProductData(url: string, store: string): Promise<ItemWebData> {
		return await puppeteerService.executeTask(
			async (page: Page, url: string) => {
				await page.goto(url, { waitUntil: 'networkidle2' });

				const title = await page.$eval(
					'[data-testid="x-item-title"] .x-item-title__mainTitle span',
					(el) => el.textContent?.trim() || ''
				);

				const priceString = await page.$eval(
					'[data-testid="x-price-primary"] span',
					(el) => el.textContent?.trim() || ''
				);

				const [currency, priceValue] = priceString.split(' ');
				const price = parseFloat(
					priceValue.replace(/\./g, '').replace(',', '.')
				);

				const oldPriceStr = await page.$eval(
					'[data-testid="x-price-transparency"] span .ux-textspans.ux-textspans--SECONDARY.ux-textspans--STRIKETHROUGH',
					(el) => el.textContent?.trim() || ''
				);
				const oldPrice = parseFloat(
					oldPriceStr.split(' ')[1].replace(/\./g, '').replace(',', '.')
				);

				await page.close();

				return {
					title: title,
					price: price,
					store: store,
					oldPrice: oldPrice,
					currency: currency,
				};
			},
			url
		);
	}
}

export default new EbayService();
