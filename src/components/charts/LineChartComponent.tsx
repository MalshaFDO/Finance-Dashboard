import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppContext } from "../../context/AppContext";
import "./Charts.css";

const LineChartComponent = () => {
  const { transactions } = useAppContext();

  const sortedTransactions = [...transactions].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const data = sortedTransactions.reduce<Array<{ date: string; balance: number }>>(
    (entries, transaction) => {
      const previousBalance = entries[entries.length - 1]?.balance ?? 0;
      const nextBalance =
        previousBalance +
        (transaction.type === "income" ? transaction.amount : -transaction.amount);

      entries.push({
        date: transaction.date,
        balance: nextBalance,
      });

      return entries;
    },
    []
  );

  return (
    <section className="chart-card">
      <div className="chart-header">
        <div>
          <p className="chart-label">Time-based view</p>
          <h3>Balance trend</h3>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="chart-frame">
          <ResponsiveContainer>
            <LineChart data={data}>
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#7ce0b8"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
                isAnimationActive
                animationDuration={700}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="chart-empty">Add transactions to see the balance trend.</div>
      )}
    </section>
  );
};

export default LineChartComponent;
