import CalculationResult from './vero/calculation-result.js';

export interface Calculation {
  taxes: CalculationResult;
  salary: number;
}
