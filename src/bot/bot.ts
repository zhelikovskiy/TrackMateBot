import { Telegraf } from 'telegraf';
import { env } from './../configs/env.config';
import userService from '../services/user.service';
import itemService from '../services/item.service';
import scrapingService from '../services/scraping.service';
import { PriceParsingError, UnsupportedStoreError } from '../errors';

const bot = new Telegraf(env.botToken);

bot.start(async (ctx) => {
	ctx.reply('Welcome!');
});

bot.help(async (ctx) => {
	ctx.reply(
		'Available commands:\n/start - Start the bot\n/help - Show help\n/check - Check item price\n/track <url> - Track an item\n/list - List tracked items\n/remove <itemId> - Remove an item from tracking\n/threshold <value> - Set price threshold\n/update - Update item prices'
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

		if (productData.oldPrice)
			ctx.reply(
				`Title: ${productData.title}\nPrice: ${productData.price} ${productData.currency}\nOld Price: ${productData.oldPrice} ${productData.currency}\nStore: ${productData.store}`
			);
		else
			ctx.reply(
				`Title: ${productData.title}\nPrice: ${productData.price} ${productData.currency}\nStore: ${productData.store}`
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
			return ctx.reply(
				'Could not retrieve product data. Please check the URL.'
			);
		}

		const item = await itemService.createItem({
			userId: user.id,
			url: url,
			name: productData.title,
			lastPrice: productData.price,
			store: productData.store,
		});

		ctx.replyWithHTML(`Item is being tracked! You will be notified when the price changes. Item info:
        \nID: ${item.id} \nName: ${item.name} \nURL: <a href="${item.url}">link</a> \nStore: ${item.store} \nPrice: ${item.lastPrice}`);
	} catch (error) {
		if (error instanceof PriceParsingError) {
			ctx.reply(`Error. ${error.message}`);
		} else if (error instanceof UnsupportedStoreError) {
			ctx.reply(`Error. ${error.message}`);
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
			(item) =>
				`ID: ${item.id}, Name: ${item.name}, URL: <a href="${item.url}">link</a>, Store: ${item.store}`
		)
		.join('\n');

	ctx.replyWithHTML(`Your tracked items:\n${itemList}`);
});

bot.command('remove', async (ctx) => {
	const { message } = ctx.update as any;
	const userId = ctx.from.id;
	const itemId = message.text.split(' ')[1];

	if (!itemId) {
		return ctx.reply('Please provide an item ID to remove.');
	}

	let user = await userService.getUser(userId);

	if (!user) {
		return ctx.reply('No items found for you.');
	}

	const item = await itemService.removeItem(Number(itemId));

	if (item === 0) {
		return ctx.reply('Item not found.');
	}

	ctx.reply(`Item removed successfully!`);
});

bot.command('update', async (ctx) => {});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

export default bot;
