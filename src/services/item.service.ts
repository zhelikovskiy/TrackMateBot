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
	createItem(data: CreateItemDto): Promise<Item> {
		return Item.create(data);
	}

	getUserItems(userId: number): Promise<Item[]> {
		return Item.findAll();
	}

	updatePrice(data: UpdateItemDto): Promise<Item | null> {
		return Item.update(
			{ lastPrice: data.price },
			{ where: { id: data.id } }
		).then(() => {
			return Item.findByPk(data.id);
		});
	}

	removeItem(id: number): Promise<number> {
		return Item.destroy({ where: { id } });
	}
}

export default new ItemService();
