import { TaxCardCalculation } from './tax-card-calculation';
import { CompanyMonies } from './cli';

const PERCENTAGE_FOR_DIVIDENTS = 8;
const PERCENTAGE_OF_TAX_FREE_DIVIDENTS = 75;
const CAPITAL_INCOME_TAX_PERCENTAGE = 30;

interface BigBrainProps {
  taxCalculations: TaxCardCalculation[];
  companyMonies: CompanyMonies;
}

const getTotalCompanyMonies = (
  calc: Pick<TaxCardCalculation, 'annualSalary' | 'annualBenefits'>,
  companyMonies: CompanyMonies,
) => {
  return (
    companyMonies.companyAssets + // todo add general company spending on software, hardware and shit
    companyMonies.companyRevenue -
    calc.annualBenefits -
    calc.annualSalary
  );
};

export const calculateDividents = (
  calc: Pick<TaxCardCalculation, 'annualSalary' | 'annualBenefits'>,
  companyMonies: CompanyMonies,
): number => {
  const companyMoneyLeftAtTheEndOfTheYear = getTotalCompanyMonies(
    calc,
    companyMonies,
  );

  const dividentPayout =
    (companyMoneyLeftAtTheEndOfTheYear / 100) * PERCENTAGE_FOR_DIVIDENTS;

  const taxFree = (dividentPayout / 100) * PERCENTAGE_OF_TAX_FREE_DIVIDENTS;
  const taxable = dividentPayout - taxFree;
  const tax = (taxable / 100) * CAPITAL_INCOME_TAX_PERCENTAGE;
  return taxFree + taxable - tax;
};

const getGrossSalary = (calc: TaxCardCalculation) => {
  const toPayInTaxes = (calc.annualSalary / 100) * calc.taxes.taxRate;
  return calc.annualSalary - toPayInTaxes;
};

const getCorporateAccountAfterExpensesAndTaxes = (
  calc: TaxCardCalculation,
  companyMonies: CompanyMonies,
): number => {
  const totalMonies = getTotalCompanyMonies(calc, companyMonies);
  const dividents = (totalMonies / 100) * PERCENTAGE_FOR_DIVIDENTS;
  return totalMonies - dividents;
};

const calculateTotalIncome = (
  calc: TaxCardCalculation,
  companyMonies: CompanyMonies,
) => {
  const dividentsAfterTaxes = calculateDividents(calc, companyMonies);
  const annualSalaryAfterTaxes = getGrossSalary(calc);
  return {
    income: {
      private: {
        annual: {
          totalAfterTaxes: dividentsAfterTaxes + annualSalaryAfterTaxes,
          dividentsAfterTaxes,
          salaryAfterTaxes: annualSalaryAfterTaxes,
        },
        monthly: {
          salaryAfterTaxes: annualSalaryAfterTaxes / 12,
          salaryBeforeTaxes: calc.annualSalary / 12,
        },
      },
      corporate: {
        annualCorporateAccountAfterExpensesAndTaxes:
          getCorporateAccountAfterExpensesAndTaxes(calc, companyMonies),
      },
    },
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
      bestCalculation.income.private.annual.totalAfterTaxes <
        income.income.private.annual.totalAfterTaxes
    ) {
      bestCalculation = {
        taxCard: calc,
        ...income,
      };
    }
  }

  return bestCalculation;
}
