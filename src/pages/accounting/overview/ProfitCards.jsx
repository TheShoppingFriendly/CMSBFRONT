export default function ProfitCards({ data }) {
  return (
    <div className="profit-grid">
      <div className="card">
        <h4>Total Profit</h4>
        <span>₹{Number(data.system_profit).toFixed(2)}</span>
      </div>

      <div className="card">
        <h4>Today's Transactions</h4>
        <span>{data.today.tx_count}</span>
      </div>

      <div className="card">
        <h4>Today's Net</h4>
        <span>₹{Number(data.today.total).toFixed(2)}</span>
      </div>
    </div>
  );
}
