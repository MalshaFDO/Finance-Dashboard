import "./SummaryCard.css";
import { useAppContext } from "../../context/AppContext";

type Props = {
  title: string;
  amount: number;
};

const SummaryCard = ({ title, amount }: Props) => {
  const { formatCurrency } = useAppContext();

  const getClass = () => {
    if (title === "Income") return "card income";
    if (title === "Expenses") return "card expense";
    return "card";
  };

  return (
    <div className={getClass()}>
      <p className="card-title">{title}</p>
      <h3 className="card-amount">{formatCurrency(amount)}</h3>
    </div>
  );
};
export default SummaryCard;
