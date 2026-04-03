import { transactions } from "./mockData";
import type { Transaction } from "../types/transactions";

const MOCK_NETWORK_DELAY_MS = 650;

export const fetchMockTransactions = async (): Promise<Transaction[]> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(transactions);
    }, MOCK_NETWORK_DELAY_MS);
  });
