import Item from '../models/item.model';

type CreateItemDto = {
	userId: number;
	url: string;
	name: string;
	lastPrice: number;
	store: string;
};

type UpdateItemDto = {
	id: number;
	price: number;
};

class ItemService {
	public async createItem(data: CreateItemDto): Promise<Item> {
		return Item.create(data);
	}

	public async getUserItems(userId: number): Promise<Item[]> {
		return Item.findAll();
	}

	public async updatePrice(data: UpdateItemDto): Promise<Item | null> {
		return Item.update(
			{ lastPrice: data.price },
			{ where: { id: data.id } }
		).then(() => {
			return Item.findByPk(data.id);
		});
	}

	public async removeItem(id: number): Promise<number> {
		return Item.destroy({ where: { id } });
	}

	public async getAllItems(): Promise<Item[]> {
		const items = await Item.findAll();
		return items;
	}
}

export default new ItemService();
