import { test, expect } from 'vitest';
import bigBrain, { calculateDividents } from './big-brain';

test('calculateDividents', () => {
  const divident = calculateDividents(
    {
      annualSalary: 0,
      annualBenefits: 0,
    },
    {
      companyRevenue: 0,
      companyAssets: 100_000,
    },
  );

  expect(divident).toBe(7400);
});

test('bigBrain', () => {
  const result = bigBrain({
    companyMonies: {
      companyRevenue: 100_000,
      companyAssets: 100_000,
    },
    taxCalculations: [
      {
        annualSalary: 100_000,
        annualBenefits: 0,
        taxes: {
          taxRate: 10,
          additionalWithholdingRate: 50,
        },
      },
    ],
  });

  expect(result).toEqual({
    taxCard: {
      annualSalary: 100000,
      annualBenefits: 0,
      taxes: {
        taxRate: 10,
        additionalWithholdingRate: 50,
      },
    },
    income: {
      private: {
        annual: {
          totalAfterTaxes: 97400,
          dividentsAfterTaxes: 7400,
          salaryAfterTaxes: 90000,
        },
        monthly: {
          salaryAfterTaxes: 7500,
          salaryBeforeTaxes: 8333.333333333334,
        },
      },
      corporate: {
        annualCorporateAccountAfterExpensesAndTaxes: 92000,
      },
    },
  });
});
