import { Page } from 'puppeteer';
import Input from './input';
import CalculationResultPage from './calculation-result-page';

export default class DeductionsPage {
  constructor(private readonly page: Page) {}

  async setEmploymentPensionContributions(val: number) {
    await Input.get(this.page, 'Dn-9a').then((e) => e.set(val.toString()));
  }

  async setTradeUnionMembershipFeesAndUnemploymentFundPayments(val: number) {
    await Input.get(this.page, 'Dn-z9').then((e) => e.set(val.toString()));
  }

  async setCommutingExpenses(val: number) {
    await Input.get(this.page, 'Dn-0a').then((e) => e.set(val.toString()));
  }

  async setOtherExpensesForTheProductionOfWageIncome(val: number) {
    await Input.get(this.page, 'Dn-4a').then((e) => e.set(val.toString()));
  }

  async setUnemploymentInsuranceContributions(val: number) {
    await Input.get(this.page, 'Dn-da').then((e) => e.set(val.toString()));
  }

  async setYelOrMyelPensionInsuranceContributions(val: number) {
    await Input.get(this.page, 'Dn-ha').then((e) => e.set(val.toString()));
  }

  async setInterestOnLoanForTheProductionOfIncome(val: number) {
    await Input.get(this.page, 'Dn-sa').then((e) => e.set(val.toString()));
  }

  async setContributionsForVoluntaryPensionInsuranceOrLongTermSavingsContract(
    val: number,
  ) {
    await Input.get(this.page, 'Dn-xa').then((e) => e.set(val.toString()));
  }

  async setOtherExpensesForProductionOfCapitalIncome(val: number) {
    await Input.get(this.page, 'Dn-2b').then((e) => e.set(val.toString()));
  }

  async next() {
    await this.page.click('button#action_7');
    return new CalculationResultPage(this.page);
  }
}
