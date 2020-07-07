import { TransactionParser, YnabTransaction } from '../../types';

const EXPENSE_REGEXP = /(?<date>\d{4}-\d{2}-\d{2});Your payment of €(?<amount>.*) to (?<payee>.+) has been successfully processed./
const INCOME_REGEXP = /(?<date>\d{4}-\d{2}-\d{2});You received a .* for €(?<amount>.*) from (?<payee>.+)\./;

type TransactionRegexp = {
  date: string
  amount: string
  payee: string
};

type Params = {
  budget_id: string
  account_id: string
}

class N26NotificationParser implements TransactionParser {
  parse(params: Params, line: string) { 
    if (EXPENSE_REGEXP.test(line)) {
      const { date, amount, payee } = EXPENSE_REGEXP.exec(line)!.groups as TransactionRegexp;
      return this.toTransaction(params, { date, amount: -Number(amount) * 1000, payee })
    }
  
    if (INCOME_REGEXP.test(line)) {
      const { date, amount, payee } = INCOME_REGEXP.exec(line)!.groups as TransactionRegexp;
      return this.toTransaction(params, { date, amount: Number(amount) * 1000, payee })
    }
    return null;
  }

  toTransaction(params: Params, {date, payee, amount}: { date: string, payee: string, amount: number }): YnabTransaction {
    return {
      date,
      amount,
      payee_name: payee,
      account_id: params.account_id,
      cleared: 'cleared',
      approved: true,
      flag_color: 'orange'
    }
  }
}

export default new N26NotificationParser();