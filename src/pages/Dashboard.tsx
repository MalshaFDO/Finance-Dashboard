import "./Dashboard.css";
import SummaryCard from "../components/cards/SummaryCard";
import { useAppContext } from "../context/AppContext";
import LineChartComponent from "../components/charts/LineChartComponent";
import PieChartComponent from "../components/charts/PieChartComponent";
import TransactionTable from "../components/transactions/TransactionTable";
import Insights from "./Insights";

const Dashboard = () => {
  const { transactions, role, isLoading } = useAppContext();

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expenses;

  return (
    <div className="dashboard">
      <section className="dashboard-hero">
        <div>
          <p className="dashboard-kicker">Overview</p>
          <h1>Track balance, spending patterns, and recent activity in one place.</h1>
          <p className="dashboard-subtitle">
            {role === "admin"
              ? "Admin mode is active, so you can add and edit transactions."
              : "Viewer mode is active, so the dashboard is read-only."}
          </p>
          {isLoading && (
            <p className="dashboard-sync-indicator">
              Syncing starter data from the mock API...
            </p>
          )}
        </div>
        <div className="dashboard-pill">
          <span>{transactions.length}</span>
          <p>transactions stored in this local demo</p>
        </div>
      </section>

      <div className="cards">
        <SummaryCard title="Total Balance" amount={balance} />
        <SummaryCard title="Income" amount={income} />
        <SummaryCard title="Expenses" amount={expenses} />
      </div>
      <div className="charts">
        <LineChartComponent />
        <PieChartComponent />
      </div>
      <TransactionTable />
      <Insights />
      <p className="dashboard-footnote">
        Demo note: transactions and role changes are stored locally in this browser.
      </p>
    </div>
  );
};

export default Dashboard;
