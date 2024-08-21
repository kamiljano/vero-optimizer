import Calculator from './vero/calculator';
import cli from './cli';
import pLimit from 'p-limit';
import { SingleBar, Presets } from 'cli-progress';
import { TaxCardCalculation } from './tax-card-calculation';
import bigBrain from './big-brain';
import TaxCardCache from './tax-card-cache';
import { Calculation } from './vero/calculation';

const BENEFITS = 0; //TODO: that should come from the user input

(async () => {
  const data = await cli();

  console.log(
    'The process will actually open multiple browser instances in the background to fill in the Vero calculator, so please, be patient...',
  );

  const promises: Promise<TaxCardCalculation>[] = [];
  const limit = pLimit(5);
  let progress = 0;
  const bar = new SingleBar({}, Presets.shades_classic);
  const cache = new TaxCardCache();

  for (
    let salary = data.salaryRange.min;
    salary <= data.salaryRange.max;
    salary += 100
  ) {
    promises.push(
      limit(async () => {
        const calculation: Calculation = {
          background: data.background,
          income: {
            pay: {
              estimateForYear: salary,
              incomeReceived: 0,
              withholdings: 0,
            },
            benefits: {
              estimateForYear: BENEFITS,
              incomeReceived: 0,
              withholdings: 0,
            },
          },
          deductions: {
            employmentPensionContributions: 0,
            tradeUnionMembershipFeesAndUnemploymentFundPayments: 0,
            commutingExpenses: 0,
            otherExpensesForTheProductionOfWageIncome: 0,
            unemploymentInsuranceContributions: 0,
            yelOrMyelPensionInsuranceContributions: 0,
            interestOnLoanForTheProductionOfIncome: 0,
            contributionsForVoluntaryPensionInsuranceOrLongTermSavingsContract: 0,
            otherExpensesForProductionOfCapitalIncome: 0,
          },
        };

        const cached = cache.get(calculation);

        const result = {
          salary,
          benefits: BENEFITS,
          taxes:
            cached ??
            (await new Calculator({
              headless: true,
            }).calculate(calculation)),
        };

        if (!cached) {
          cache.set(calculation, result.taxes);
        }

        progress++;
        bar.update(progress);

        return result;
      }),
    );
  }

  bar.start(promises.length, progress);

  const taxCalculations = await Promise.all(promises);

  const result = bigBrain({
    taxCalculations,
    companyMonies: data.companyMonies,
  });

  console.log(result);
  process.exit(0);
})();
