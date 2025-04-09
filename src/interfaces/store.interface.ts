interface StoreInterface {
	getProductData(url: string): Promise<{ name: string; price: number }>;
}

export default StoreInterface;
