# YNAB Transactions Importer

Command line utility for importing YNAB transactions from text files. 

### How does it work

> Disclaimer: this CLI was mainly created to solve a very particular problem I've had - if your use case is different please create an issue so we can fix/discuss/implement it together!

This CLI will parse each one of the lines of a text file (using a custom JS parser which needs to be written by you!)
into a YNAB Transaction and use YNAB's API to import this data.

### How to use it

1. Log in to YNAB and get your personal API token.
2. Create a .js parser function (example below) somewhere in your filesystem
3. Invoke the CLI

```sh
Usage: ynab-file-importer [options]

Options:
  --help      Show help                                                [boolean]
  --version   Show version number                                      [boolean]
  --input     File containing list of transactions which will be created.
              Must end with a line break and have one transaction per line.
              Each line of this file will be supplied as an input to the parser
              function.                                      [string] [required]
  --parser                                                   [string] [required]
  --budget    Budget ID. Can be found in YNABs URL after logging in.
              e.g https://app.youneedabudget.com/<budget_id> [string] [required]
  --defaults  JSON containing additional params which will be added to each one
              of the transactions.
              Check the definiton "#/definitions/SaveTransaction" at
              https://api.youneedabudget.com/v1#/Transactions/createTransaction
              for a list of all accepted fields.             [string] [required]
  --skip      Optional number of lines which will be skipped when parsing the
              input file.                                               [number]

```

### Examples

**Importing all transactions in a file**

```sh
YNAB_API_TOKEN=<personal API token> \
  ynab-file-importer \
    --input '~/transactions.txt' \
    --budget <budget_id> \
    --parser '~/my-parser.js' \
    --defaults '{ "account_id": "<ynab account id>" }'
```
**Skipping already imported lines**

```sh
YNAB_API_TOKEN=<personal API token> \
  ynab-file-importer \
    --input '~/transactions.txt' \
    --budget <budget_id> \
    --parser '~/my-parser.js' \
    --defaults '{ "account_id": "<ynab account id>", "flag_color": "green" }' \
    --skip $(cat output.txt 2>/dev/null || echo "0") \
  && wc -l < transactions.txt > output.txt
```

**Example parser**

```js
const EXPENSE_REGEXP = /(?<date>\d{4}-\d{2}-\d{2});Your payment of €(?<amount>.*) to (?<payee_name>.+) has been successfully processed./
const INCOME_REGEXP = /(?<date>\d{4}-\d{2}-\d{2});You received a .* for €(?<amount>.*) from (?<payee_name>.+)\./;

export default function parse (line) {
  if (EXPENSE_REGEXP.test(line)) {
    const { date, amount, payee_name } = EXPENSE_REGEXP.exec(line).groups;
    return { date, amount: Number(amount) * 1000, payee_name };
  }

  if (INCOME_REGEXP.test(line)) {
    const { date, amount, payee_name } = INCOME_REGEXP.exec(line)!.groups;
    return { date, amount: Number(amount) * 1000, payee_name };
  }
  return null;
}
```

### Motivation

_Wait, what?_
YNAB is a great personal budgeting software. I've been using it for years and I love it. 
Unfortunately they don't integrate directly with many popular european banks (e.g Revolut, N26), so I ended
up writing this utility to suit my needs. 

How I use it: I configured my smartphone to save my bank push notifications to a text file (which is automatically synced to my other devices) and this CLI uses that text file to import transactions into YNAB.