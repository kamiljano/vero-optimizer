import { Page } from 'puppeteer';
import EditableDropdown from './editable-dropdown';

export type Parish =
  | 'Civil Register'
  | 'Evangelical Lutheran Church'
  | 'German Congregation'
  | 'Olaus Petri'
  | 'Orthodox Church of Finland';

export default class BackgroundPage {
  constructor(private readonly page: Page) {}

  private async getYearRadios() {
    const yearRadios = await this.page.$$('.FGFCBW label');

    if (!yearRadios.length) {
      throw new Error('Failed to find year radios in the Background page');
    }

    return Promise.all(
      yearRadios.map(async (radio) => {
        return {
          year: await this.page.evaluate(
            (el) => parseInt(el.textContent.trim(), 10),
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
    return new EditableDropdown(this.page, 'Dn-k');
  }

  private getParishDropdown() {
    return new EditableDropdown(this.page, 'Dn-l');
  }

  async setMunicipality(municipality: string) {
    await this.getMunicipalityDropdown().select(municipality);
  }

  async setParish(parish: Parish) {
    await this.getParishDropdown().select(parish);
  }

  private getYearOfBirthDropdown() {
    return new EditableDropdown(this.page, 'Dn-m');
  }

  async setYearOfBirth(year: number) {
    await this.getYearOfBirthDropdown().select(year.toString());
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
  }
}
