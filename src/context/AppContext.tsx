import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Role, Theme, Transaction } from "../types/transactions";
import type { CurrencyCode } from "../types/currency";
import { transactions as mockTransactions } from "../data/mockData";
import { fetchMockTransactions } from "../data/mockApi";
import { isCurrencyCode } from "../types/currency";
import { formatCurrency as formatCurrencyUtil } from "../utils/formatCurrency";

const STORAGE_KEY = "finance-dashboard-state";

type StoredState = {
  role: Role;
  transactions: Transaction[];
  currency: CurrencyCode;
};

type AppContextType = {
  transactions: Transaction[];
  role: Role;
  theme: Theme;
  currency: CurrencyCode;
  isLoading: boolean;
  setRole: (role: Role) => void;
  setTheme: (theme: Theme) => void;
  setCurrency: (currency: CurrencyCode) => void;
  toggleTheme: () => void;
  formatCurrency: (value: number) => string;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (transactionId: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const getInitialState = (): StoredState => {
  if (typeof window === "undefined") {
    return {
      role: "viewer",
      transactions: mockTransactions,
      currency: "LKR",
    };
  }

  document.documentElement.dataset.theme = "dark";
  document.body.dataset.theme = "dark";

  const storedState = window.localStorage.getItem(STORAGE_KEY);

  if (!storedState) {
    return {
      role: "viewer",
      transactions: mockTransactions,
      currency: "LKR",
    };
  }

  try {
    const parsedState = JSON.parse(storedState) as Partial<StoredState>;

    return {
      role: parsedState.role === "admin" ? "admin" : "viewer",
      transactions: Array.isArray(parsedState.transactions)
        ? parsedState.transactions
        : mockTransactions,
      currency: isCurrencyCode(parsedState.currency) ? parsedState.currency : "LKR",
    };
  } catch {
    return {
      role: "viewer",
      transactions: mockTransactions,
      currency: "LKR",
    };
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [initialState] = useState(getInitialState);
  const [transactions, setTransactions] = useState<Transaction[]>(initialState.transactions);
  const [role, setRole] = useState<Role>(initialState.role);
  const [theme, setTheme] = useState<Theme>("dark");
  const [currency, setCurrency] = useState<CurrencyCode>(initialState.currency);
  const [isLoading, setIsLoading] = useState(false);

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  const updateTransaction = (transaction: Transaction) => {
    setTransactions((prev) =>
      prev.map((currentTransaction) =>
        currentTransaction.id === transaction.id ? transaction : currentTransaction
      )
    );
  };

  const deleteTransaction = (transactionId: string) => {
    setTransactions((prev) =>
      prev.filter((transaction) => transaction.id !== transactionId)
    );
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  const formatCurrency = (value: number) => formatCurrencyUtil(value, currency);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedState = window.localStorage.getItem(STORAGE_KEY);

    if (storedState) return;

    setIsLoading(true);

    void fetchMockTransactions()
      .then((apiTransactions) => {
        setTransactions(apiTransactions);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        role,
        transactions,
        currency,
      })
    );
  }, [role, transactions, currency]);

  return (
    <AppContext.Provider
      value={{
        transactions,
        role,
        theme,
        currency,
        isLoading,
        setRole,
        setTheme,
        setCurrency,
        toggleTheme,
        formatCurrency,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
