import BackgroundPage from './vero/background-page';
import { Background } from './vero/calculator';
import { input, select } from '@inquirer/prompts';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

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

export default async function cli() {
  const info = await BackgroundPage.getInfo();

  const args = await yargs(hideBin(process.argv))
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

  return { background, salaryRange };
}
