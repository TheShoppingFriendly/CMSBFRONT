export default function UserTimeline({ ledger }) {
  return (
    <div className="timeline">
      <h3>Finance Timeline</h3>
      {ledger.map(row => (
        <div key={row.id} className="timeline-row">
          <span>{row.transaction_type}</span>
          <span>₹{(row.credit - row.debit).toFixed(2)}</span>
          <span>{new Date(row.created_at).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
