import TaxCard from './vero/tax-card';

export interface TaxCardCalculation {
  taxes: TaxCard;
  annualSalary: number;
  annualBenefits: number;
}
