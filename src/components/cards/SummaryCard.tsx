import "./SummaryCard.css";

type Props = {
  title: string;
  amount: number;
};

const SummaryCard = ({ title, amount }: Props) => {
  const getClass = () => {
    if (title === "Income") return "card income";
    if (title === "Expenses") return "card expense";
    return "card";
  };

  return (
    <div className={getClass()}>
      <p className="card-title">{title}</p>
      <h3 className="card-amount">
        {new Intl.NumberFormat("en-LK", {
          style: "currency",
          currency: "LKR",
          maximumFractionDigits: 0,
        }).format(amount)}
      </h3>
    </div>
  );
};
export default SummaryCard;
