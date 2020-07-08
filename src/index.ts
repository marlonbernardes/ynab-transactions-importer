#!/usr/bin/env node

import * as importTransactions  from './import-transactions'
import yargs from 'yargs';
import { CliOptions } from './types';
import { logger } from './lib/utils/logger';

const parseCliArguments = (): CliOptions => {
  const { input, parser, budget, defaults, skip } = yargs
    .usage('Usage: $0 [options]')
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
      defaults: {
        type: 'string',
        description: `JSON containing additional params which will be added to each one of the transactions. 
          Check the definiton "#/definitions/SaveTransaction" at https://api.youneedabudget.com/v1#/Transactions/createTransaction
          for a list of all accepted fields.`
      },  
      skip: { 
        type: 'number',
        description: 'Optional number of lines which will be skipped when parsing the input file.'
      },  
    }) 
    .demandOption(['input', 'parser', 'budget', 'defaults'])
    .strict()
    .argv;
    
    return { input, parser, budget, defaults: defaults ? JSON.parse(defaults) : {}, skip: skip || 0 };
  };

const start = async () => {
  const args = parseCliArguments();
  await importTransactions.run(args);
}

start().catch(err => {
  logger.error(err)
  process.exit(1);
});
