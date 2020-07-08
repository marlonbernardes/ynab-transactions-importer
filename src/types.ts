export type TransactionParser = (line: string) => YnabTransaction | null

export type CliOptions = {
  input: string
  parser: string
  budget: string
  defaults: Partial<YnabTransaction>
  skip: number
}

export type YnabTransaction = {
  date?: string
  amount?: number
  payee_id?: string
  payee_name?: string
  account_id?: string
  category_id?: string
  memo?: string
  cleared?: string
  approved?: boolean
  flag_color?: string
  import_id?: string
  subtransactions?: YnabSubTransaction[]
}

export type YnabSubTransaction = {
  amount: number
  payee_id: string
  payee_name: string
  category_id: string
  memo: string
}
