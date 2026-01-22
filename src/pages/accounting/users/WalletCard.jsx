export default function WalletCard({ wallet }) {
  return (
    <div className="wallet-card">
      <h3>User Wallet</h3>
      <p>Affiliate Balance: ₹{wallet.affiliate_balance}</p>
      <p>Referral Balance: ₹{wallet.referral_balance}</p>
      <p>Pending: ₹{wallet.affiliate_pending}</p>
      <p>Lifetime Earned: ₹{wallet.total_lifetime_earned}</p>
    </div>
  );
}
