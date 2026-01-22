import { useEffect, useState } from "react";
import { getWallet } from "../api/finance.api";
import WalletCard from "./WalletCard";
import UserTimeline from "./UserTimeline";
import "./users.css";

export default function UserFinancePage({ wpUserId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    getWallet(wpUserId).then(res => setData(res.data));
  }, [wpUserId]);

  if (!data) return null;

  return (
    <div className="user-finance">
      <WalletCard wallet={data.wallet} />
      <UserTimeline ledger={data.ledger} />
    </div>
  );
}
