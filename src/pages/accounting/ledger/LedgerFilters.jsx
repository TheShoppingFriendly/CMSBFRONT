export default function LedgerFilters() {
  return (
    <div className="filters">
      <input placeholder="User ID" />
      <input placeholder="Store ID" />
      <select>
        <option value="">All Types</option>
        <option value="PAYOUT_APPROVED">Payout Approved</option>
        <option value="CONVERSION_RECORDED">Conversion</option>
      </select>
    </div>
  );
}
