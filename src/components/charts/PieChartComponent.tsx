import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppContext } from "../../context/AppContext";
import "./Charts.css";

const COLORS = ["#4CAF50", "#FF6384", "#36A2EB", "#FFCE56"];

const PieChartComponent = () => {
  const { transactions } = useAppContext();

  const categoryMap: { [key: string]: number } = {};

  transactions.forEach((t) => {
    if (t.type === "expense") {
      categoryMap[t.category] =
        (categoryMap[t.category] || 0) + t.amount;
    }
  });

  const data = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  return (
    <section className="chart-card">
      <div className="chart-header">
        <div>
          <p className="chart-label">Category-based view</p>
          <h3>Expense breakdown</h3>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="chart-frame">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" label isAnimationActive animationDuration={700}>
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="chart-empty">No expense data yet, so the spending breakdown is empty.</div>
      )}
    </section>
  );
};

export default PieChartComponent;
