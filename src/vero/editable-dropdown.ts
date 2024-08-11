import { Page } from 'puppeteer';

export default class EditableDropdown {
  constructor(
    private readonly page: Page,
    private readonly id: string,
  ) {}

  async select(value: string) {
    const dropdown = await this.page.$(`#${this.id}`);
    if (!dropdown) {
      throw new Error(`Failed to find dropdown with id ${this.id}`);
    }
    await dropdown.click();
    await dropdown.type(value);
    await this.page.keyboard.press('Enter');
  }
}
