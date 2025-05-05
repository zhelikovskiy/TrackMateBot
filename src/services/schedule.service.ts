import schedule from 'node-schedule';
import itemService from './item.service';
import scrapingService from './scraping.service';
import bot from '../bot/bot';

class ScheduleService {
	private job: schedule.Job | null = null;

	public start() {
		if (this.job) {
			console.log('Job is already running.');
			return;
		}

		this.job = schedule.scheduleJob('0 12 * * *', async () => {
			console.log('Running a price check:', new Date());
			await this.checkPrices();
		});
		console.log('ScheduleService started');
	}

	public stop() {
		if (this.job) {
			this.job.cancel();
			this.job = null;
			console.log('ScheduleService stopped');
		}
	}

	public async checkPrices() {
		const items = await itemService.getAllItems();
		for (const item of items) {
			const data = await scrapingService.getProductData(item.url);
			if (data && data.price < item.lastPrice) {
				const discount =
					((item.lastPrice - data.price) / item.lastPrice) * 100;
				await bot.telegram.sendMessage(
					item.userId,
					`🎉 Discount on "${item.name}"!\n` +
						`Was: $${item.lastPrice}\n` +
						`Set: $${data.price}\n` +
						`Discount: ${discount.toFixed(2)}%\n` +
						`Store: <a href="${item.url}">${item.store}</a>`,
					{ parse_mode: 'HTML' }
				);
				await itemService.updatePrice({
					id: item.id,
					price: data.price,
				});
			}
		}
	}
}

export default new ScheduleService();
