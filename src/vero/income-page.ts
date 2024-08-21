import { Page } from 'puppeteer';
import Input from './input.js';
import DeductionsPage from './deductions-page.js';

export default class IncomePage {
  constructor(private readonly page: Page) {}

  async setIncomeEstimateForYear(val: number) {
    await Input.get(this.page, 'Dn-52').then((e) => e.set(val.toString()));
  }

  async setIncomeReceived(val: number) {
    await Input.get(this.page, 'Dn-62').then((e) => e.set(val.toString()));
  }

  async setIncomeWithholdings(val: number) {
    await Input.get(this.page, 'Dn-72').then((e) => e.set(val.toString()));
  }

  async setBenefitsEstimateForYear(val: number) {
    await Input.get(this.page, 'Dn-l3').then((e) => e.set(val.toString()));
  }

  async setBenefitsReceived(val: number) {
    await Input.get(this.page, 'Dn-m3').then((e) => e.set(val.toString()));
  }

  async setBenefitsWithholdings(val: number) {
    await Input.get(this.page, 'Dn-n3').then((e) => e.set(val.toString()));
  }

  async next() {
    await this.page.click('button#action_7');
    return new DeductionsPage(this.page);
  }
}
