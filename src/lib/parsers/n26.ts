import { YnabTransaction } from '../../types';

const EXPENSE_REGEXP = /(?<date>\d{4}-\d{2}-\d{2});Your payment of €(?<amount>.*) to (?<payee_name>.+) has been successfully processed./
const INCOME_REGEXP = /(?<date>\d{4}-\d{2}-\d{2});You received a .* for €(?<amount>.*) from (?<payee_name>.+)\./;

type TransactionRegexp = {
  date: string
  amount: string
  payee_name: string
  test: string
};

export default function parse (line: string): YnabTransaction | null {
  if (EXPENSE_REGEXP.test(line)) {
    const { date, amount, payee_name } = EXPENSE_REGEXP.exec(line)!.groups as TransactionRegexp;
    return { date, amount: Number(amount) * 1000, payee_name };
  }

  if (INCOME_REGEXP.test(line)) {
    const { date, amount, payee_name } = INCOME_REGEXP.exec(line)!.groups as TransactionRegexp;
    return { date, amount: Number(amount) * 1000, payee_name };
  }
  return null;
}