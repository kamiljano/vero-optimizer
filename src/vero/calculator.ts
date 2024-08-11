import puppeteer, { Page } from 'puppeteer';
import BackgroundPage, { Parish } from './background-page';
import { setTimeout } from 'node:timers/promises';
import IncomePage from './income-page';

interface Background {
  taxYear: number;
  municipality: string;
  parish: Parish;
  yearOfBirth: number;
  spouse: boolean;

  //todo: number of children
  //todo: insurance outside of finland
}

interface IncomeEstimate {
  estimateForYear: number;
  incomeReceived: number;
  withholdings: number;
}

interface Income {
  pay: IncomeEstimate;
  benefits: IncomeEstimate;

  //todo: the rest
}

interface Calculation {
  background: Background;
  income: Income;
}

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
  }

  async calculate(calculation: Calculation) {
    const browser = await puppeteer.launch({ headless: this.props.headless });
    const page = await browser.newPage();
    await page.goto(
      'https://avoinomavero.vero.fi/?Language=ENG&Link=IITTaxRateCalc',
    );

    const incomePage = await this.calculateBackground(
      page,
      calculation.background,
    );
    await this.calculateIncome(incomePage, calculation.income);

    await setTimeout(5000);

    await browser.close();
  }
}
