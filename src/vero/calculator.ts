import puppeteer, { Page } from 'puppeteer';
import BackgroundPage, { STARTING_PAGE_URL } from './background-page';
import IncomePage from './income-page';
import DeductionsPage from './deductions-page';
import TaxCard from './tax-card';
import { Background, Calculation, Deductions, Income } from './calculation';
import { setTimeout } from 'node:timers/promises';

interface CalculatorProps {
  headless: boolean;
}

export default class Calculator {
  constructor(private readonly props: CalculatorProps) {}

  private async calculateBackground(page: Page, background: Background) {
    const backgroundPage = new BackgroundPage(page);
    await backgroundPage.setYear(background.taxYear);
    await backgroundPage.setMunicipality(background.municipality);
    await backgroundPage.setParish(background.parish);
    await backgroundPage.setYearOfBirth(background.yearOfBirth);

    if (background.spouse) {
      await backgroundPage.setSpouse();
    }

    return backgroundPage.next();
  }

  private async calculateIncome(page: IncomePage, income: Income) {
    await page.setIncomeEstimateForYear(income.pay.estimateForYear);
    await page.setIncomeReceived(income.pay.incomeReceived);
    await page.setIncomeWithholdings(income.pay.withholdings);
    await page.setBenefitsEstimateForYear(income.benefits.estimateForYear);
    await page.setBenefitsReceived(income.benefits.incomeReceived);
    await page.setBenefitsWithholdings(income.benefits.withholdings);
    return page.next();
  }

  private async calculateDeductions(
    page: DeductionsPage,
    deductions: Deductions,
  ) {
    await page.setEmploymentPensionContributions(
      deductions.employmentPensionContributions,
    );
    await page.setTradeUnionMembershipFeesAndUnemploymentFundPayments(
      deductions.tradeUnionMembershipFeesAndUnemploymentFundPayments,
    );
    await page.setCommutingExpenses(deductions.commutingExpenses);
    await page.setOtherExpensesForTheProductionOfWageIncome(
      deductions.otherExpensesForTheProductionOfWageIncome,
    );
    await page.setUnemploymentInsuranceContributions(
      deductions.unemploymentInsuranceContributions,
    );
    await page.setYelOrMyelPensionInsuranceContributions(
      deductions.yelOrMyelPensionInsuranceContributions,
    );
    await page.setInterestOnLoanForTheProductionOfIncome(
      deductions.interestOnLoanForTheProductionOfIncome,
    );
    await page.setContributionsForVoluntaryPensionInsuranceOrLongTermSavingsContract(
      deductions.contributionsForVoluntaryPensionInsuranceOrLongTermSavingsContract,
    );
    await page.setOtherExpensesForProductionOfCapitalIncome(
      deductions.otherExpensesForProductionOfCapitalIncome,
    );

    return page.next();
  }

  private async runCalculation(calculation: Calculation): Promise<TaxCard> {
    const browser = await puppeteer.launch({ headless: this.props.headless });

    try {
      const page = await browser.newPage();
      await page.goto(STARTING_PAGE_URL);

      const incomePage = await this.calculateBackground(
        page,
        calculation.background,
      );

      const deductionsPage = await this.calculateIncome(
        incomePage,
        calculation.income,
      );

      const resultPage = await this.calculateDeductions(
        deductionsPage,
        calculation.deductions,
      );

      return await resultPage.getCalculationResult();
    } finally {
      await browser.close();
    }
  }

  async calculate(calculation: Calculation): Promise<TaxCard> {
    const maxAttempts = 3;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        return await this.runCalculation(calculation);
      } catch (err) {
        if (attempt === maxAttempts - 1) {
          throw err;
        }
        await setTimeout(3000);
      }
    }

    throw new Error('Unexpected error');
  }
}
