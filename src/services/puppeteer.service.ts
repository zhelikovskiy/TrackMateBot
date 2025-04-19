import { Page } from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';

class PuppeteerService {
	private cluster!: Cluster;

	constructor() {
		this.initCluster();
	}

	private async initCluster() {
		this.cluster = await Cluster.launch({
			concurrency: Cluster.CONCURRENCY_CONTEXT,
			maxConcurrency: 5,
			puppeteerOptions: {
				headless: true,
				args: ['--no-sandbox', '--disable-setuid-sandbox'],
			},
		});
	}

	public async executeTask<T>(
		task: (page: Page, data: T) => Promise<any>,
		data: T
	): Promise<any> {
		return new Promise((resolve, reject) => {
			this.cluster.execute({ task, data }, async ({ page, data }) => {
				try {
					const result = await task(page, data);
					resolve(result);
				} catch (error) {
					reject(error);
				}
			});
		});
	}

	public async closeCluster() {
		if (this.cluster) {
			await this.cluster.idle();
			await this.cluster.close();
		}
	}

	destroyed() {
		this.closeCluster();
	}
}

export default new PuppeteerService();
