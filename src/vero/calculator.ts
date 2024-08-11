import puppeteer, { Page } from 'puppeteer';
import BackgroundPage, { Parish } from './background-page';
import { setTimeout } from 'node:timers/promises';

interface Background {
  taxYear: number;
  municipality: string;
  parish: Parish;
  yearOfBirth: number;
  spouse: boolean;

  //todo: number of children
  //todo: insurance outside of finland
}

interface Calculation {
  background: Background;
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

    await backgroundPage.next();
  }

  async calculate(calculation: Calculation) {
    const browser = await puppeteer.launch({ headless: this.props.headless });
    const page = await browser.newPage();
    await page.goto(
      'https://avoinomavero.vero.fi/?Language=ENG&Link=IITTaxRateCalc',
    );

    await this.calculateBackground(page, calculation.background);

    await setTimeout(2000);

    await browser.close();
  }
}
