import TaxCard from './vero/tax-card';

export interface TaxCardCalculation {
  taxes: TaxCard;
  salary: number;
  benefits: number;
}
