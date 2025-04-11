import StoreInterface, { ItemWebData } from '../../interfaces/store.interface';
import puppeteerService from '../puppeteer.service';

class EbayService implements StoreInterface {
	async getProductData(url: string): Promise<ItemWebData> {
		const page = await puppeteerService.getPage();
		await page.goto(url, { waitUntil: 'networkidle2' });

		// await page.waitForSelector('[data-testid="x-price-primary"]', {
		// 	visible: true,
		// });

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

		await page.close();

		return {
			title: title,
			price: price,
			store: 'ebay',
			currency: currency,
		};
	}
}

export default new EbayService();
