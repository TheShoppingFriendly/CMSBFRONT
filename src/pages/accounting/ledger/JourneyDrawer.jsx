export default function JourneyDrawer({ data, onClose }) {
  return (
    <div className="drawer">
      <h3>Transaction Journey</h3>
      <button onClick={onClose}>Close</button>

      {data.map(row => (
        <div key={row.id} className="journey-row">
          <span>{row.transaction_type}</span>
          <span>₹{(row.credit - row.debit).toFixed(2)}</span>
          <span>{new Date(row.created_at).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
