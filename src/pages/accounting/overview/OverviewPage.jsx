import { useEffect, useState } from "react";
import { getOverview } from "../api/finance.api";
import ProfitCards from "./ProfitCards";
import TrendChart from "./TrendChart";
import "./overview.css";

export default function OverviewPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getOverview().then(res => setData(res.data));
  }, []);

  if (!data) return <div className="loading">Loading finance...</div>;

  return (
    <div className="overview">
      <h2>Accounting Overview</h2>
      <ProfitCards data={data} />
      <TrendChart />
    </div>
  );
}
