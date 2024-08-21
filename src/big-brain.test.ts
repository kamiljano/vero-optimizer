import { test, expect } from 'vitest';
import bigBrain, { calculateDividents } from './big-brain';

test('calculateDividents', () => {
  const divident = calculateDividents(
    {
      salary: 0,
      benefits: 0,
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
      companyRevenue: 100000,
      companyAssets: 10000,
    },
    taxCalculations: [
      {
        salary: 10000,
        benefits: 0,
        taxes: {
          taxRate: 10,
          additionalWithholdingRate: 5,
        },
      },
    ],
  });

  expect(result).toEqual({
    calculation: {
      salary: 10000,
      benefits: 0,
      taxes: {
        taxRate: 10,
        additionalWithholdingRate: 5,
      },
    },
    totalIncome: 16400,
  });
});
