import React, { useState } from "react";
import "./RewardsPage.css";
import { useNavigate } from "react-router-dom";

function RewardsPage() {
  const navigate = useNavigate();

  // Fake user data
  const [points, setPoints] = useState(1340);

  const rewards = [
    { id: 1, title: "₹100 Discount Coupon", cost: 500 },
    { id: 2, title: "Free Delivery Voucher", cost: 300 },
    { id: 3, title: "₹250 Special Coupon", cost: 900 },
    { id: 4, title: "10% Off on Electronics", cost: 750 },
  ];

  const getLevel = () => {
    if (points >= 2000) return "Platinum";
    if (points >= 1000) return "Gold";
    return "Silver";
  };

  const getProgress = () => {
    if (points >= 2000) return 100;
    if (points >= 1000) return ((points - 1000) / 1000) * 100;
    return (points / 1000) * 100;
  };

  const handleRedeem = (cost) => {
    if (points < cost) {
      alert("❌ Not enough points!");
      return;
    }

    setPoints(points - cost);
    alert("🎉 Reward redeemed successfully!");
  };

  return (
    <div className="rewards-container">

      {/* Top Bar */}
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate("/products")}>← Back</button>
        <h2>Rewards</h2>
      </div>

      {/* Points Box */}
      <div className="points-box">
        <h3>Your Points</h3>
        <div className="points-value">{points}</div>
        <p className="level">Level: <span>{getLevel()}</span></p>

        <div className="progress">
          <div className="progress-fill" style={{ width: `${getProgress()}%` }}></div>
        </div>
        <p className="upgrade-info">
          {points >= 2000
            ? "🔥 You are at the highest level!"
            : `Earn ${1000 - points} more points to reach Gold!`}
        </p>
      </div>

      {/* Rewards List */}
      <h3 className="section-title">Redeem Rewards</h3>

      <div className="reward-list">
        {rewards.map((reward) => (
          <div key={reward.id} className="reward-card">
            <h4>{reward.title}</h4>
            <p>Cost: <b>{reward.cost} points</b></p>

            <button
              className={`redeem-btn ${points < reward.cost ? "disabled" : ""}`}
              onClick={() => handleRedeem(reward.cost)}
              disabled={points < reward.cost}
            >
              {points < reward.cost ? "Not enough points" : "Redeem"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RewardsPage;
