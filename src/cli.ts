import BackgroundPage from './vero/background-page';
import { input, select } from '@inquirer/prompts';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import pkg from '../package.json';
import { Background } from './vero/calculation';

const getBackground = async (
  info: Awaited<ReturnType<typeof BackgroundPage.getInfo>>,
  args: { taxYear?: number },
): Promise<Background> => {
  let taxYear = args.taxYear;

  if (!taxYear) {
    taxYear = await select({
      message: 'Tax year',
      default: Math.max(...info.taxYears),
      choices: info.taxYears.map((t) => ({
        value: t,
        name: t.toString(),
      })),
    });
  }

  return {
    taxYear,
    municipality: 'Helsinki',
    parish: 'Civil Register',
    yearOfBirth: 1989,
    spouse: true,
  };
};

interface SalaryRange {
  min: number;
  max: number;
}

const inputInt = async (message: string): Promise<number> => {
  const val = await input({
    message,
    required: true,
    validate(val: string) {
      const num = parseInt(val, 10);
      if (isNaN(num)) {
        return 'Please enter a valid integer';
      }
      return true;
    },
  });

  return parseInt(val, 10);
};

const getSalaryRange = async (args: {
  minSalary?: number;
  maxSalary?: number;
}): Promise<SalaryRange> => {
  let minSalary = args.minSalary;
  let maxSalary = args.maxSalary;

  if (!minSalary) {
    minSalary = await inputInt(
      'Minimum salary that you are willing to pay yourself in a year',
    );
  }

  if (!maxSalary) {
    maxSalary = await inputInt(
      'Maximum salary that you are willing to pay yourself in a year',
    );
  }

  return {
    min: minSalary,
    max: maxSalary,
  };
};

export interface CompanyMonies {
  companyRevenue: number;
  companyAssets: number;
}

const getCompanyMonies = async (args: {
  companyRevenue?: number;
  currentCompanyAssets?: number;
}): Promise<CompanyMonies> => {
  let companyRevenue = args.companyRevenue;
  let companyAssets = args.currentCompanyAssets;

  if (typeof companyRevenue === 'undefined') {
    companyRevenue = await inputInt(
      'Total revenue of your OY company by the end of the year',
    );
  }

  if (typeof companyAssets === 'undefined') {
    companyAssets = await inputInt('Total current assets of your OY company');
  }

  return {
    companyRevenue,
    companyAssets,
  };
};

export default async function cli() {
  const info = await BackgroundPage.getInfo();

  const args = await yargs(hideBin(process.argv))
    .version(pkg.version)
    .options({
      taxYear: {
        type: 'number',
        alias: 'y',
        choices: info.taxYears,
        description: "The year for which you're calculating the taxes",
      },
      minSalary: {
        type: 'number',
        alias: 'm',
        description:
          "The minimum salary that you're willing to pay yourself in a year",
      },
      maxSalary: {
        type: 'number',
        alias: 'x',
        description:
          "The maximum salary that you're willing to pay yourself in a year",
      },
      companyRevenue: {
        type: 'number',
        alias: 'r',
        description:
          'The total revenue of your OY company by the end of the year',
      },
      currentCompanyAssets: {
        type: 'number',
        alias: 'a',
        description: 'The total current assets of your OY company',
      },
    })
    .check((args) => {
      if (
        args.minSalary &&
        args.maxSalary &&
        args.minSalary >= args.maxSalary
      ) {
        throw new Error(
          'The minimum salary must be less than the maximum salary',
        );
      }
      return args;
    })
    .strictOptions()
    .parseAsync();

  const background = await getBackground(info, args);

  const salaryRange = await getSalaryRange(args);
  const companyMonies = await getCompanyMonies(args);

  return { background, salaryRange, companyMonies };
}
