import { ElementHandle, Page } from 'puppeteer';

export default class Input {
  static async get(page: Page, id: string) {
    await page.waitForSelector(`#${id}`, {
      timeout: 5000,
    });
    const element = await page.$(`#${id}`);
    if (!element) {
      throw new Error(`Failed to find the input with id ${id}`);
    }
    return new Input(element);
  }

  private constructor(private readonly element: ElementHandle<Element>) {}

  async set(val: string) {
    await this.element.type(val);
  }
}
