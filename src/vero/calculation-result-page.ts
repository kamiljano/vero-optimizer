import { Page } from 'puppeteer';
import TaxCard from './tax-card';
import Input from './input';

export default class CalculationResultPage {
  constructor(private readonly page: Page) {}

  private async getNumber(inputId: string): Promise<number> {
    const input = await Input.get(this.page, inputId);
    const resultStr = await input.get();
    const resultNum = parseFloat(resultStr);

    if (isNaN(resultNum)) {
      throw new Error(`Failed to parse the numerical value of ${inputId}`);
    }

    return resultNum;
  }

  getTaxRate() {
    return this.getNumber('Dn-fj');
  }

  getAdditionalWithholdingRate() {
    return this.getNumber('Dn-gj');
  }

  async getCalculationResult(): Promise<TaxCard> {
    const [taxRate, additionalWithholdingRate] = await Promise.all([
      this.getTaxRate(),
      this.getAdditionalWithholdingRate(),
    ]);
    return {
      taxRate,
      additionalWithholdingRate,
    };
  }
}
