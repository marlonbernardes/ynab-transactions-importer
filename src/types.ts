export interface TransactionParser {
  parse(params: ParserParams, line: string): YnabTransaction | null
} 

export type ParserParams = any;

export type CliOptions = {
  input: string
  parser: string
  budget: string
  parserParams: ParserParams
  skip: number
}
  
// @TODO define according to YNAB spec
export type YnabTransaction = {
  date: string
  amount: number
  payee_name: string
  account_id: string
  cleared: 'cleared' | 'uncleared'
  approved: boolean
  flag_color: string
}