export type Transaction = {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: "income" | "expense";
};

export type Role = "admin" | "viewer";
export type Theme = "dark" | "light";
