import fetch, { Response } from 'node-fetch';
import { YnabTransaction } from '../../types';

const { YNAB_API_TOKEN } = process.env;
const BASE_URL = 'https://api.youneedabudget.com/';

export const request = (url: string, method: string, data: unknown) =>
  fetch(`${BASE_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${YNAB_API_TOKEN}`
    },
    body: JSON.stringify(data)
  })
  .then((response: Response) => response.json().then((data) => {
    if (!response.ok) {
      return Promise.reject(data);
    }
    return data;
  }));

export const saveTransactions = (budgetId: string, transactions: YnabTransaction[]) =>
  request(`/v1/budgets/${budgetId}/transactions`, 'POST', { transactions });
