import puppeteer, { Page } from 'puppeteer';
import EditableDropdown from './editable-dropdown';
import IncomePage from './income-page';

export type Parish =
  | 'Civil Register'
  | 'Evangelical Lutheran Church'
  | 'German Congregation'
  | 'Olaus Petri'
  | 'Orthodox Church of Finland';

export const STARTING_PAGE_URL =
  'https://avoinomavero.vero.fi/?Language=ENG&Link=IITTaxRateCalc';

export default class BackgroundPage {
  static async getInfo() {
    const browser = await puppeteer.launch({ headless: true });
    try {
      const page = await browser.newPage();
      await page.goto(STARTING_PAGE_URL);
      await page.waitForSelector('.FGFCBW label', { timeout: 5000 });

      const taxYears = await page.$$eval('.FGFCBW label', (labels) =>
        labels.map((label) => parseInt(label.textContent!.trim(), 10)),
      );

      return { taxYears };
    } finally {
      await browser.close();
    }
  }

  constructor(private readonly page: Page) {}

  private async getYearRadios() {
    await this.page.waitForSelector('.FGFCBW label');
    const yearRadios = await this.page.$$('.FGFCBW label');

    if (!yearRadios.length) {
      throw new Error('Failed to find year radios in the Background page');
    }

    return Promise.all(
      yearRadios.map(async (radio) => {
        return {
          year: await this.page.evaluate(
            (el) => parseInt(el.textContent!.trim(), 10),
            radio,
          ),
          select() {
            return radio.click();
          },
        };
      }),
    );
  }

  async setYear(year: number) {
    const radios = await this.getYearRadios();

    for (const radio of radios) {
      if (radio.year === year) {
        await radio.select();
        return;
      }
    }

    throw new Error(
      `Unable to find the year ${year} in the Background page. Available years: ${radios.map((r) => r.year).join(', ')}`,
    );
  }

  private getMunicipalityDropdown() {
    return EditableDropdown.get(this.page, 'Dn-k');
  }

  private getParishDropdown() {
    return EditableDropdown.get(this.page, 'Dn-l');
  }

  async setMunicipality(municipality: string) {
    await this.getMunicipalityDropdown().then((e) => e.select(municipality));
  }

  async setParish(parish: Parish) {
    await this.getParishDropdown().then((e) => e.select(parish));
  }

  private getYearOfBirthDropdown() {
    return EditableDropdown.get(this.page, 'Dn-m');
  }

  async setYearOfBirth(year: number) {
    await this.getYearOfBirthDropdown().then((e) => e.select(year.toString()));
  }

  async setSpouse() {
    const spouseCheckbox = await this.page.$('label[for="Dn-q_0"]');
    if (!spouseCheckbox) {
      throw new Error(
        'Failed to find the spouse checkbox in the Background page',
      );
    }
    await spouseCheckbox.click();
  }

  async next() {
    await this.page.click('button#action_7');
    return new IncomePage(this.page);
  }
}
