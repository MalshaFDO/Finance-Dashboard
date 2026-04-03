import "./Insights.css";
import { useAppContext } from "../context/AppContext";

const Insights = () => {
  const { transactions } = useAppContext();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(value);

  const formatMonth = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });

  // Only expenses
  const expenses = transactions.filter((t) => t.type === "expense");

  // Category totals
  const categoryMap: { [key: string]: number } = {};

  expenses.forEach((t) => {
    categoryMap[t.category] =
      (categoryMap[t.category] || 0) + t.amount;
  });

  // Find highest
  let topCategory = "";
  let maxAmount = 0;

  for (const key in categoryMap) {
    if (categoryMap[key] > maxAmount) {
      maxAmount = categoryMap[key];
      topCategory = key;
    }
  }

  // Total expense
  const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0);
  const incomeTotal = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const monthlyExpenseMap: Record<string, number> = {};

  expenses.forEach((t) => {
    const monthKey = t.date.slice(0, 7);
    monthlyExpenseMap[monthKey] = (monthlyExpenseMap[monthKey] || 0) + t.amount;
  });

  const sortedMonths = Object.keys(monthlyExpenseMap).sort();
  const currentMonthKey = sortedMonths[sortedMonths.length - 1];
  const previousMonthKey = sortedMonths[sortedMonths.length - 2];

  const currentMonthTotal = currentMonthKey ? monthlyExpenseMap[currentMonthKey] : 0;
  const previousMonthTotal = previousMonthKey ? monthlyExpenseMap[previousMonthKey] : 0;
  const balance = incomeTotal - totalExpense;
  const savingsRate = incomeTotal > 0 ? Math.round((balance / incomeTotal) * 100) : 0;
  const hasOnlyIncomeTransactions = transactions.length > 0 && expenses.length === 0;

  let monthlyComparison = "Not enough monthly data yet.";
  let observation = "Add more transactions to unlock stronger insights.";

  if (currentMonthKey && previousMonthKey) {
    const difference = currentMonthTotal - previousMonthTotal;

    if (difference > 0) {
      monthlyComparison = `${formatMonth(currentMonthKey)} spending is ${formatCurrency(difference)} higher than ${formatMonth(previousMonthKey)}.`;
    } else if (difference < 0) {
      monthlyComparison = `${formatMonth(currentMonthKey)} spending is ${formatCurrency(Math.abs(difference))} lower than ${formatMonth(previousMonthKey)}.`;
    } else {
      monthlyComparison = `${formatMonth(currentMonthKey)} spending matches ${formatMonth(previousMonthKey)}.`;
    }
  } else if (currentMonthKey) {
    monthlyComparison = `Only ${formatMonth(currentMonthKey)} data is available so far.`;
  }

  if (topCategory && totalExpense > 0) {
    const share = Math.round((maxAmount / totalExpense) * 100);
    observation = `${topCategory} makes up ${share}% of all tracked expenses, so it is the biggest optimization opportunity.`;
  } else if (hasOnlyIncomeTransactions) {
    observation =
      "Only income transactions are available so far, so spending insights will appear after you add expenses.";
    monthlyComparison = "Add at least one expense transaction to compare monthly spending.";
  }

  return (
    <section className="insights">
      <h3>Insights</h3>
      <div className="insight-grid">
        <div className="insight-card">
          <p>Highest spending category</p>
          <h4>{topCategory || (hasOnlyIncomeTransactions ? "No expenses tracked yet" : "N/A")}</h4>
          <span>
            {maxAmount > 0
              ? formatCurrency(maxAmount)
              : hasOnlyIncomeTransactions
                ? "Add an expense to populate this card"
                : "No expense data yet"}
          </span>
        </div>

        <div className="insight-card">
          <p>Monthly comparison</p>
          <h4>{monthlyComparison}</h4>
        </div>

        <div className="insight-card">
          <p>Net position</p>
          <h4>{formatCurrency(balance)}</h4>
          <span>{incomeTotal > 0 ? `${savingsRate}% of income retained` : "Waiting for income data"}</span>
        </div>

        <div className="insight-card">
          <p>Observation</p>
          <h4>{observation}</h4>
        </div>
      </div>
    </section>
  );
};

export default Insights;
