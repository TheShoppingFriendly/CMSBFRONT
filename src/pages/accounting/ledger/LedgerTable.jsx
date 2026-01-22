import { useEffect, useState } from "react";
import { getLedger, getJourney } from "../api/finance.api";
import JourneyDrawer from "./JourneyDrawer";

export default function LedgerTable() {
  const [rows, setRows] = useState([]);
  const [journey, setJourney] = useState(null);

  useEffect(() => {
    getLedger().then(res => setRows(res.data));
  }, []);

  return (
    <>
      <table className="ledger-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>User</th>
            <th>Type</th>
            <th>Net</th>
            <th>Journey</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{new Date(r.created_at).toLocaleString()}</td>
              <td>{r.wp_user_id}</td>
              <td>{r.transaction_type}</td>
              <td>₹{(r.credit - r.debit).toFixed(2)}</td>
              <td>
                <button
                  onClick={async () => {
                    const res = await getJourney(r.journey_id);
                    setJourney(res.data);
                  }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {journey && (
        <JourneyDrawer data={journey} onClose={() => setJourney(null)} />
      )}
    </>
  );
}
