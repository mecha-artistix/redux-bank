import { useSelector } from "react-redux";

function formatCurrency(value) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function BalanceDisplay() {
  const accountBalanace = useSelector((store) => store.account.balance);
  return <div className="balance">{formatCurrency(accountBalanace)}</div>;
}

export default BalanceDisplay;
