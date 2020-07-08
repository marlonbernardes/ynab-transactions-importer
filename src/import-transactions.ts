import { saveTransactions } from './lib/ynab-api/client';
import { readFileLines } from './lib/utils/files';
import { TransactionParser, CliOptions } from './types';
import { logger } from './lib/utils/logger';

export async function run(options: CliOptions) {
  const parser = (await import(options.parser)).default as TransactionParser;
  const unprocessed = readFileLines(options.input, { skip: options.skip });
  const isNotNull = <T>(value: T): value is NonNullable<T> => !!value;
  const transactions = unprocessed
    .map(line => parser(line))
    .filter(isNotNull)
    .map(transaction => (Object.assign({}, options.defaults, transaction )))

  if (transactions.length > 0) {
    logger.info(transactions);
    await saveTransactions(options.budget, transactions);  
  }
  logger.info('Command executed successfully');
}