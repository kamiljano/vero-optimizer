import { ElementHandle, Page } from 'puppeteer';

export default class EditableDropdown {
  static async get(page: Page, id: string) {
    await page.waitForSelector(`#${id}`, {
      timeout: 5000,
    });
    const dropdown = await page.$(`#${id}`);
    if (!dropdown) {
      throw new Error(`Failed to find dropdown with id ${id}`);
    }

    return new EditableDropdown(page, dropdown);
  }

  private constructor(
    private readonly page: Page,
    private readonly element: ElementHandle<Element>,
  ) {}

  async select(value: string) {
    await this.element.click();
    await this.element.type(value);
    await this.page.keyboard.press('Enter');
  }
}
