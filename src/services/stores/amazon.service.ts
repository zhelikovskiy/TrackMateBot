import StoreInterface, { ItemWebData } from '../../interfaces/store.interface';
import puppeteerService from '../puppeteer.service';
import { PriceParsingError } from '../../errors';
import axios from 'axios';

class AmazonService implements StoreInterface {
	// async getProductData(url: string): Promise<any> {
	// 	const page = await puppeteerService.getPage();
	// 	await page.goto(url, { waitUntil: 'networkidle2' });

	// 	const itemInfo: ItemWebData = {
	// 		price: 0,
	// 		title: '',
	// 		store: 'amazon',
	// 		currency: '',
	// 	};

	// 	const titleStr = await page.$eval(
	// 		'#productTitle',
	// 		(el) => el.textContent?.trim() || ''
	// 	);
	// 	itemInfo.title = titleStr;

	// 	const firstPriceElement = await page.$('.a-price.a-text-price');
	// 	if (firstPriceElement) {
	// 		const firstPriceStr = await page.$eval(
	// 			'.a-price.a-text-price',
	// 			(el) => el.querySelector('span')?.textContent?.trim() || ''
	// 		);
	// 		const priceMatch = firstPriceStr.match(
	// 			/([\d.,]+)([^\d]+)?|([^\d]+)([\d.,]+)/
	// 		);
	// 		if (priceMatch) {
	// 			if (priceMatch[1]) {
	// 				itemInfo.price = parseFloat(priceMatch[1].replace(',', '.'));
	// 				itemInfo.currency = priceMatch[2]?.trim() || '';
	// 			} else if (priceMatch[3]) {
	// 				itemInfo.currency = priceMatch[3]?.trim() || '';
	// 				itemInfo.price = parseFloat(priceMatch[4].replace(',', '.'));
	// 			}
	// 		}
	// 	}

	// 	const secondPriceStr1 = await page.$eval(
	// 		'.a-price-whole',
	// 		(el) => el.textContent?.trim() || ''
	// 	);
	// 	const secondPriceStr2 = await await page.$eval(
	// 		'.a-price-fraction',
	// 		(el) => el.textContent?.trim() || ''
	// 	);
	// 	const secondPrice = parseFloat(`${secondPriceStr1}${secondPriceStr2}`);

	// 	const currency = await await page.$eval(
	// 		'.a-price-symbol',
	// 		(el) => el.textContent?.trim() || ''
	// 	);

	// 	itemInfo.price =
	// 		secondPrice < itemInfo.price ? secondPrice : itemInfo.price;
	// 	itemInfo.currency = currency;

	// 	await page.close();

	// 	if (!itemInfo.price)
	// 		throw new PriceParsingError('Cannot get price for this item.');

	// 	return itemInfo;
	// }

	async getProductData(url: string): Promise<any> {
		const page = await puppeteerService.getPage();
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
			'.a-price.a-text-price .a-offscreen',
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
			store: 'amazon',
			currency: currency,
			oldPrice: oldPrice,
		};

		return itemInfo;
	}
}

export default new AmazonService();
