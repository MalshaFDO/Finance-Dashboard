import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
  payload?: ReadonlyArray<{ value?: unknown }>;
  label?: unknown;
  currency: CurrencyCode;
};

const BalanceTooltip = ({ active, payload, label, currency }: BalanceTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  const value = Number(payload[0]?.value ?? 0);

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
      <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>{String(label ?? "")}</div>
      <div style={{ fontWeight: 800, fontSize: 14, lineHeight: 1.1 }}>
        {formatNumber(value, currency)}
      </div>
      <div style={{ fontSize: 12, opacity: 0.85 }}>{currency}</div>
    </div>
  );
};

const LineChartComponent = () => {
  const { transactions, currency } = useAppContext();

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
            <LineChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                tickMargin={10}
                padding={{ left: 16, right: 16 }}
              />
              <YAxis
                stroke="#94a3b8"
                width={76}
                tickMargin={8}
                padding={{ bottom: 6, top: 6 }}
                tick={(props) => <YAxisTick {...props} currency={currency} />}
              />
              <Tooltip content={(props) => <BalanceTooltip {...props} currency={currency} />} />
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
