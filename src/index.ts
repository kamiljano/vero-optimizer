import Calculator from './vero/calculator';
import cli from './cli';
import pLimit from 'p-limit';
import { SingleBar, Presets } from 'cli-progress';
import { Calculation } from './calculation';

(async () => {
  const data = await cli();

  console.log(
    'The process will actually open multiple browser instances in the background to fill in the Vero calculator, so please, be patient...',
  );

  const promises: Promise<Calculation>[] = [];
  const limit = pLimit(5);
  let progress = 0;
  const bar = new SingleBar({}, Presets.shades_classic);

  for (
    let salary = data.salaryRange.min;
    salary <= data.salaryRange.max;
    salary += 100
  ) {
    promises.push(
      limit(async () => {
        const result = {
          salary,
          taxes: await new Calculator({
            headless: true,
          }).calculate({
            background: data.background,
            income: {
              pay: {
                estimateForYear: salary,
                incomeReceived: 0,
                withholdings: 0,
              },
              benefits: {
                estimateForYear: 0,
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
          }),
        };

        progress++;
        bar.update(progress);

        return result;
      }),
    );
  }

  bar.start(promises.length, progress);

  const results = await Promise.all(promises);
  results.forEach((r) => {
    console.log(`Salary: ${r.salary}`);
    console.log(r.taxes);
  });
})();
