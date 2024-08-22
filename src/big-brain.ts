import { TaxCardCalculation } from './tax-card-calculation';
import { CompanyMonies } from './cli';

const PERCENTAGE_FOR_DIVIDENTS = 8;
const PERCENTAGE_OF_TAX_FREE_DIVIDENTS = 75;
const CAPITAL_INCOME_TAX_PERCENTAGE = 30;

interface BigBrainProps {
  taxCalculations: TaxCardCalculation[];
  companyMonies: CompanyMonies;
}

export const calculateDividents = (
  calc: Pick<TaxCardCalculation, 'salary' | 'benefits'>,
  companyMonies: CompanyMonies,
): number => {
  const companyMoneyLeftAtTheEndOfTheYear =
    companyMonies.companyAssets +
    companyMonies.companyRevenue -
    calc.benefits -
    calc.salary;

  const dividentPayout =
    (companyMoneyLeftAtTheEndOfTheYear / 100) * PERCENTAGE_FOR_DIVIDENTS;

  const taxFree = (dividentPayout / 100) * PERCENTAGE_OF_TAX_FREE_DIVIDENTS;
  const taxable = dividentPayout - taxFree;
  const tax = (taxable / 100) * CAPITAL_INCOME_TAX_PERCENTAGE;
  return taxFree + taxable - tax;
};

const getGrossSalary = (calc: TaxCardCalculation) => {
  const toPayInTaxes = (calc.salary / 100) * calc.taxes.taxRate;
  return calc.salary - toPayInTaxes;
};

const calculateTotalIncome = (
  calc: TaxCardCalculation,
  companyMonies: CompanyMonies,
) => {
  const dividents = calculateDividents(calc, companyMonies);
  const annualSalaryAfterTaxes = getGrossSalary(calc);
  return {
    totalAnnualIncomeAfterTaxes: dividents + annualSalaryAfterTaxes,
    dividents,
    annualSalaryAfterTaxes,
    monthlySalaryAfterTaxes: annualSalaryAfterTaxes / 12,
    monthlySalaryBeforeTaxes: calc.salary / 12,
  };
};

export default function bigBrain({
  taxCalculations,
  companyMonies,
}: BigBrainProps) {
  let bestCalculation:
    | ({
        taxCard: TaxCardCalculation;
      } & ReturnType<typeof calculateTotalIncome>)
    | undefined = undefined;

  for (let calc of taxCalculations) {
    const income = calculateTotalIncome(calc, companyMonies);
    if (
      !bestCalculation ||
      bestCalculation.totalAnnualIncomeAfterTaxes <
        income.totalAnnualIncomeAfterTaxes
    ) {
      bestCalculation = {
        taxCard: calc,
        ...income,
      };
    }
  }

  return bestCalculation;
}
