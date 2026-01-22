import { useEffect, useState } from "react";
import { getLedger, approvePayout } from "../api/finance.api";
import PayoutTable from "./PayoutTable";
import "./payouts.css";

export default function PayoutQueue() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getLedger({ type: "PAYOUT_PENDING" }).then(res => setRows(res.data));
  }, []);

  return (
    <div className="payouts">
      <h2>Payout Queue</h2>
      <PayoutTable rows={rows} onApprove={approvePayout} />
    </div>
  );
}
