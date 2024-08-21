import { test } from 'vitest';
import bigBrain from './big-brain';

test('bigBrain', () => {
  bigBrain([
    {
      salary: 10000,
      taxes: {
        taxRate: 10,
        additionalWithholdingRate: 5,
      },
    },
    {
      salary: 20000,
      taxes: {
        taxRate: 20,
        additionalWithholdingRate: 5,
      },
    },
  ]);
});
