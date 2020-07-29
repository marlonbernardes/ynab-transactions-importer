import { YnabTransaction } from '../../types';

const EXPENSE_REGEXPS = [
  /(?<date>\d{4}-\d{2}-\d{2});Your payment of €(?<amount>.*) to (?<payee_name>.+) has been successfully processed./
];
const INCOME_REGEXPS = [
  /(?<date>\d{4}-\d{2}-\d{2});You received a .* of €(?<amount>.*) from (?<payee_name>.+)\./,
  /(?<date>\d{4}-\d{2}-\d{2});You\'ve received a .* of €\s?(?<amount>.*) from (?<payee_name>.+)\./,
  /(?<date>\d{4}-\d{2}-\d{2});Your refund of €\s?(?<amount>.*) from (?<payee_name>.+) has been successfully processed\./,
];

type TransactionRegexp = {
  date: string
  amount: string
  payee_name: string
  test: string
};

const parseAmount = (amount: string) => {
  const fractionalIndex = Math.max(amount.lastIndexOf('.'), amount.lastIndexOf(','));
  const fractional = amount.substring(fractionalIndex+1);
  const integer = amount.substring(0, fractionalIndex);
  const cents = (Number(integer.replace(',', '')) * 100 + Number(fractional));
  const centsToMilliUnits = (val: number) => val * 10;
  return centsToMilliUnits(cents);
}

export default function parse (line: string): YnabTransaction | null {
  for (const exp of EXPENSE_REGEXPS) {
    if (exp.test(line)) {
      const { date, amount, payee_name } = exp.exec(line)!.groups as TransactionRegexp;
      return { date, amount: -parseAmount(amount), payee_name };
    }
  }

  for (const exp of INCOME_REGEXPS) {
    if (exp.test(line)) {
      const { date, amount, payee_name } = exp.exec(line)!.groups as TransactionRegexp;
      return { date, amount: parseAmount(amount), payee_name };
    }
  }

  return null;
}
