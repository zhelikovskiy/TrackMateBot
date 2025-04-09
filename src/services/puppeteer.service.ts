import puppeteer, { Browser, Page } from 'puppeteer';

class PuppeteerService {
	private browser!: Browser;

	constructor() {
		this.initBrowser();
	}

	private async initBrowser() {
		this.browser = await puppeteer.launch({
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});
	}

	public async getPage(): Promise<Page> {
		return await this.browser.newPage();
	}

	private async closeBrowser() {
		if (this.browser) {
			await this.browser.close();
		}
	}

	destroyed() {
		this.closeBrowser();
	}
}

export default new PuppeteerService();
