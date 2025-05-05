import { UnsupportedStoreError } from '../errors';
import StoreInterface, { ItemWebData } from '../interfaces/store.interface';
import amazonService from './stores/amazon.service';
import ebayService from './stores/ebay.service';

export type ItemData = {
	title: string;
	price: number;
};

class ScrapingService {
	private stores: { [key: string]: StoreInterface };

	constructor() {
		this.stores = {
			amazon: amazonService,
			ebay: ebayService,
			'amazon.de': amazonService,
		};
	}

	private identifyStore(url: string): string | null {
		if (url.includes('amazon.de')) {
			return 'amazon.de';
		} else if (url.includes('amazon')) {
			return 'amazon';
		} else if (url.includes('ebay')) {
			return 'ebay';
		}
		return null;
	}

	public async getProductData(url: string): Promise<ItemWebData> {
		const storeKey = this.identifyStore(url);
		if (!storeKey || !this.stores[storeKey]) {
			throw new UnsupportedStoreError();
		}

		return await this.stores[storeKey].getProductData(url, storeKey);
	}
}

export default new ScrapingService();
