import { Telegraf } from 'telegraf';
import { env } from './../configs/env.config';
import userService from '../services/user.service';
import itemService from '../services/item.service';
import scrapingService from '../services/scraping.service';
import scheduleService from '../services/schedule.service';
import {
	DiscountAlreadyExistsError,
	ItemIdNotFoundError,
	ItemNotFoundError,
	PriceParsingError,
	UnsupportedStoreError,
	UserHasNoTrackedItemsError,
} from '../errors';

const bot = new Telegraf(env.botToken);

scheduleService.start();

bot.start(async (ctx) => {
	ctx.replyWithHTML(
		`<b>Hi! I'm TrackMateBot!</b>\n` +
			`I can help you not miss out on the deals on products you want to purchase!\n` +
			`I'm a test version and may be running erratically right now. Currently, I support only Amazon and eBay items.\n` +
			`To find out what I can do, send <b>/help</b>\n`
	);
});

bot.help(async (ctx) => {
	ctx.replyWithHTML(
		`<b>Available Commands:</b>\n` +
			`<b>/start</b> - Start the bot\n` +
			`<b>/help</b> - Show this help message\n` +
			`<b>/check &lt;url&gt;</b> - Check item price\n` +
			`<b>/track &lt;url&gt;</b> - Track an item\n` +
			`<b>/list</b> - List tracked items\n` +
			`<b>/remove &lt;itemId&gt;</b> - Remove an item from tracking\n`
	);
});

bot.command('check', async (ctx) => {
	try {
		const { message } = ctx.update as any;
		const url = message.text.split(' ')[1];

		if (!url) {
			return ctx.reply('Please provide a URL to track.');
		}

		const productData = await scrapingService.getProductData(url);
		if (!productData) {
			return ctx.reply(
				'Could not retrieve product data. Please check the URL.'
			);
		}

		const priceDetails = productData.oldPrice
			? `Price: <b>${productData.price} ${productData.currency}</b>\n` +
			  `Old Price: <b>${productData.oldPrice} ${productData.currency}</b>`
			: `Price: <b>${productData.price} ${productData.currency}</b>`;

		ctx.replyWithHTML(
			`Title: <b>${productData.title}</b>\n` +
				`${priceDetails}\n` +
				`Store: <b>${productData.store}</b>`
		);
	} catch (error) {
		if (error instanceof PriceParsingError) {
			ctx.reply(`Sorry. ${error.message}`);
		} else {
			console.error('Error checking product data:', error);
			ctx.reply(
				'Sorry. An error occurred while checking the product data.'
			);
		}
	}
});

bot.command('track', async (ctx) => {
	try {
		const { message } = ctx.update as any;
		const url = message.text.split(' ')[1];

		if (!url) {
			return ctx.reply('Please provide a URL to track.');
		}

		const userId = ctx.from.id;

		let user = await userService.getUser(userId);

		if (!user) {
			user = await userService.createUser({ id: userId });
		}

		const productData = await scrapingService.getProductData(url);
		if (!productData) {
			throw new PriceParsingError();
		}

		if (productData.oldPrice) {
			throw new DiscountAlreadyExistsError();
		}

		const item = await itemService.createItem({
			userId: user.id,
			url: url,
			name: productData.title,
			lastPrice: productData.price,
			store: productData.store,
		});

		ctx.replyWithHTML(
			`Item is now being tracked!\n\n<b>Item Details:</b>\n` +
				`ID: <b>${item.id}</b>\n` +
				`Name: <b>${item.name}</b>\n` +
				`URL: <a href="${item.url}"><b>link</b></a>\n` +
				`Store: <b>${item.store}</b>\n` +
				`Price: <b>${item.lastPrice} ${productData.currency}</b>\n\n` +
				`You will be notified when the price changes.`
		);
	} catch (error) {
		if (error instanceof PriceParsingError) {
			ctx.reply(`Error. ${error.message}`);
		} else if (error instanceof UnsupportedStoreError) {
			ctx.reply(`Error. ${error.message}`);
		} else if (error instanceof DiscountAlreadyExistsError) {
			ctx.reply(`${error.message}`);
		} else {
			console.error('Error tracking product:', error);
			ctx.reply('Sorry. An error occurred while tracking the product.');
		}
	}
});

bot.command('list', async (ctx) => {
	const { message } = ctx.update as any;
	const userId = ctx.from.id;

	let user = await userService.getUser(userId);

	if (!user) {
		return ctx.reply('No items found for you.');
	}

	const items = await itemService.getUserItems(user.id);

	if (items.length === 0) {
		return ctx.reply('No items found for you.');
	}

	const itemList = items
		.map(
			(item, index) =>
				`${index + 1}. Name: <b>${item.name}</b>\n` +
				`   ID: <b>${item.id}</b>\n` +
				`   URL: <a href="${item.url}"><b>link</b></a>\n` +
				`   Store: <b>${item.store}</b>\n`
		)
		.join('\n\n');

	ctx.replyWithHTML(`<b>Your tracked items:</b>\n\n${itemList}`);
});

bot.command('remove', async (ctx) => {
	try {
		const { message } = ctx.update as any;
		const userId = ctx.from.id;
		const itemId = message.text.split(' ')[1];

		if (!itemId) {
			throw new ItemIdNotFoundError();
		}

		let user = await userService.getUser(userId);

		if (!user) {
			throw new UserHasNoTrackedItemsError();
		}

		const item = await itemService.removeItem(Number(itemId));

		if (item === 0) {
			throw new ItemNotFoundError();
		}

		ctx.reply(`Item removed successfully!`);
	} catch (error) {
		if (error instanceof ItemIdNotFoundError) {
			ctx.reply(`Error. ${error.message}`);
		} else if (error instanceof UserHasNoTrackedItemsError) {
			ctx.reply(`Error. ${error.message}`);
		} else if (error instanceof ItemNotFoundError) {
			ctx.reply(`Error. ${error.message}`);
		} else {
			ctx.reply('Sorry. An error occurred while removing the item.');
		}
		console.error('Error removing item:', error);
		ctx.reply('Sorry. An error occurred while removing the item.');
	}
});

process.once('SIGINT', () => {
	scheduleService.stop();
	bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
	scheduleService.stop();
	bot.stop('SIGTERM');
});

export default bot;
