#!/usr/bin/env node

import * as importTransactions  from './import-transactions'
import yargs from 'yargs';
import { CliOptions } from './types';
import { logger } from './lib/utils/logger';

const parseCliArguments = (): CliOptions => {
  const { input, parser, budget, parserParams, skip } = yargs
    .usage('Usage: $0 <command> [options]')
    .command('import', 'Import transactions into YNAB from a corresponding transaction file.')
    .options({
      input: { 
        type: 'string', 
        description: `File containing list of transactions which will be created. 
           Must end with a line break and have one transaction per line. 
           Each line of this file will be supplied as an input to the parser function.` 
      },  
      parser: { 
        type: 'string', 
      },  
      budget: { 
        type: 'string',
        description: `Budget ID. Can be found in YNABs URL after logging in.
          e.g https://app.youneedabudget.com/<budget_id>`
      },  
      parserParams: {
        type: 'string',
        description: 'JSON containing additional params which will be supplied to the parser'
      },  
      skip: { 
        type: 'number',
        description: 'Optional number of lines which will be skipped when parsing the input file.'
      },  
    }) 
    .demandOption(['input', 'parser', 'budget', 'parserParams'])
    .demandCommand()
    .strict()
    .argv;
    
    return { input, parser, budget, parserParams: parserParams ? JSON.parse(parserParams) : {}, skip: skip || 0 };
  };

const start = async () => {
  const args = parseCliArguments();
  await importTransactions.run(args);
}

start().catch(err => {
  logger.error(err)
});
