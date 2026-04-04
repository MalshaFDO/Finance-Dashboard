import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAppContext } from "../../context/AppContext";
import type { CurrencyCode } from "../../types/currency";
import { formatNumber } from "../../utils/formatCurrency";
import "./Charts.css";

type YAxisTickProps = {
  x?: number | string;
  y?: number | string;
  payload?: { value: unknown };
  currency: CurrencyCode;
};

const YAxisTick = ({ x = 0, y = 0, payload, currency }: YAxisTickProps) => {
  const value = Number(payload?.value ?? 0);
  const amount = formatNumber(value, currency);

  return (
    <text x={Number(x)} y={Number(y)} fill="#94a3b8" textAnchor="end" dominantBaseline="middle">
      <tspan x={Number(x)} dy="-0.25em">
        {amount}
      </tspan>
      <tspan x={Number(x)} dy="1.2em" opacity={0.8}>
        {currency}
      </tspan>
    </text>
  );
};

type BalanceTooltipProps = {
  active?: boolean;
  payload?: ReadonlyArray<{ value?: unknown; dataKey?: unknown; name?: unknown }>;
  label?: unknown;
  currency: CurrencyCode;
};

const BalanceTooltip = ({ active, payload, label, currency }: BalanceTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  const valueMap = new Map<string, number>();
  payload.forEach((entry) => {
    const key = String(entry.dataKey ?? entry.name ?? "");
    valueMap.set(key, Number(entry.value ?? 0));
  });

  const incomeValue = valueMap.get("income") ?? 0;
  const expenseValue = valueMap.get("expense") ?? 0;

  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: 14,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        background: "rgba(10, 14, 19, 0.94)",
        color: "white",
        boxShadow: "0 18px 48px rgba(0, 0, 0, 0.38)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>{`Date: ${String(label ?? "")}`}</div>

      <div style={{ display: "grid", gap: 8 }}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 4 }}>Income</div>
          <div style={{ fontWeight: 800, fontSize: 14, lineHeight: 1.1 }}>
            {formatNumber(incomeValue, currency)}
          </div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>{currency}</div>
        </div>

        <div>
          <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 4 }}>Expense</div>
          <div style={{ fontWeight: 800, fontSize: 14, lineHeight: 1.1 }}>
            {formatNumber(expenseValue, currency)}
          </div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>{currency}</div>
        </div>
      </div>
    </div>
  );
};

const ChartLegend = (props: { payload?: Array<{ color?: string; value?: string }> }) => {
  const items = props.payload ?? [];
  if (items.length === 0) return null;

  return (
    <div className="chart-legend" aria-label="Chart legend">
      {items.map((item) => (
        <div key={item.value} className="chart-legend-item">
          <span className="chart-legend-swatch" style={{ background: item.color }} />
          <span className="chart-legend-label">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

const LineChartComponent = () => {
  const { transactions, currency } = useAppContext();
  const [isNarrow, setIsNarrow] = useState(() => window.innerWidth <= 520);

  useEffect(() => {
    const handleResize = () => setIsNarrow(window.innerWidth <= 520);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sortedTransactions = [...transactions].sort((a, b) => a.date.localeCompare(b.date));

  const dailyTotals = sortedTransactions.reduce<Record<string, { income: number; expense: number }>>(
    (map, transaction) => {
      const current = map[transaction.date] ?? { income: 0, expense: 0 };
      if (transaction.type === "income") current.income += transaction.amount;
      else current.expense += transaction.amount;
      map[transaction.date] = current;
      return map;
    },
    {}
  );

  const data = Object.keys(dailyTotals)
    .sort()
    .reduce<Array<{ date: string; income: number; expense: number }>>((entries, date) => {
      const today = dailyTotals[date];

      entries.push({
        date,
        income: today.income,
        expense: today.expense,
      });

      return entries;
    }, []);

  return (
    <section className="chart-card">
      <div className="chart-header">
        <div>
          <p className="chart-label">Time-based view</p>
          <h3>Income vs expense</h3>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="chart-frame">
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                tickMargin={10}
                padding={{ left: 16, right: 16 }}
                minTickGap={18}
                interval={isNarrow ? "preserveStartEnd" : 0}
                tickFormatter={(value) => (isNarrow ? String(value).slice(5) : String(value))}
              />
              <YAxis
                stroke="#94a3b8"
                width={isNarrow ? 62 : 76}
                tickMargin={8}
                padding={{ bottom: 6, top: 6 }}
                tick={(props) => <YAxisTick {...props} currency={currency} />}
              />
              <Tooltip content={(props) => <BalanceTooltip {...props} currency={currency} />} />
              <Line
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#d4af37"
                strokeWidth={2.6}
                dot={false}
                isAnimationActive
                animationDuration={700}
              />
              <Line
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke="#ff8f7a"
                strokeWidth={2.6}
                dot={false}
                isAnimationActive
                animationDuration={700}
              />
              <Legend verticalAlign="bottom" align="left" content={<ChartLegend />} />
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
