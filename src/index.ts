import Calculator from './vero/calculator';

(async () => {
  const result = await new Calculator({
    headless: true,
  }).calculate({
    background: {
      taxYear: 2024,
      municipality: 'Helsinki',
      parish: 'Civil Register',
      yearOfBirth: 1989,
      spouse: true,
    },
    income: {
      pay: {
        estimateForYear: 60000,
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
  });

  console.log(result);
})();
