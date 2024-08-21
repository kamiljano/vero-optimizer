import { Parish } from './background-page';

export interface Background {
  taxYear: number;
  municipality: string;
  parish: Parish;
  yearOfBirth: number;
  spouse: boolean;

  //todo: number of children
  //todo: insurance outside of finland
}

export interface IncomeEstimate {
  estimateForYear: number;
  incomeReceived: number;
  withholdings: number;
}

export interface Income {
  pay: IncomeEstimate;
  benefits: IncomeEstimate;

  //todo: the rest
}

export interface Deductions {
  employmentPensionContributions: number;
  tradeUnionMembershipFeesAndUnemploymentFundPayments: number;
  commutingExpenses: number;
  otherExpensesForTheProductionOfWageIncome: number;
  unemploymentInsuranceContributions: number;
  yelOrMyelPensionInsuranceContributions: number;
  interestOnLoanForTheProductionOfIncome: number;
  contributionsForVoluntaryPensionInsuranceOrLongTermSavingsContract: number;
  otherExpensesForProductionOfCapitalIncome: number;

  //todo: the rest
}

export interface Calculation {
  background: Background;
  income: Income;
  deductions: Deductions;
}
