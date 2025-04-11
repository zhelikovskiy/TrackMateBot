export type ItemWebData = {
	title: string;
	price: number;
	currency: string;
	store: string;
};

interface StoreInterface {
	getProductData(url: string): Promise<ItemWebData>;
}

export default StoreInterface;
