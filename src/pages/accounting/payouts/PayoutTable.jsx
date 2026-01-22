export default function PayoutTable({ rows, onApprove }) {
  return (
    <table className="ledger-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Amount</th>
          <th>Approve</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.id}>
            <td>{r.wp_user_id}</td>
            <td>₹{r.debit}</td>
            <td>
              <button
                onClick={() =>
                  onApprove({
                    wpUserId: r.wp_user_id,
                    amount: r.debit,
                    conversionId: r.entity_id
                  })
                }
              >
                Approve
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
