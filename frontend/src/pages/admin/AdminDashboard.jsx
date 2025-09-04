import React, { useEffect, useState } from "react";
import { getPRStats } from "../../services/pressReleaseService";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPR: 0,
    pendingPR: 0,
    publishedPR: 0,
    rejectedPR: 0,
  });

  useEffect(() => {
    const fetchPRStats = async () => {
      try {
        const data = await getPRStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch PR stats:", error);
      }
    };

    fetchPRStats();
  }, []);

  const cards = [
    {
      title: "Total Press Releases",
      value: stats.totalPR,
      bg: "#4f46e5", // Indigo
    },
    {
      title: "Pending Press Releases",
      value: stats.pendingPR,
      bg: "#f59e0b", // Amber
    },
    {
      title: "Approved Press Releases",
      value: stats.publishedPR,
      bg: "#16a34a", // Green
    },
    {
      title: "Rejected Press Releases",
      value: stats.rejectedPR,
      bg: "#dc2626", // Red
    },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      {/* Summary Cards */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "2rem",
          flexWrap: "wrap",
        }}
      >
        {cards.map((card, idx) => (
          <div
            key={idx}
            style={{
              padding: "1rem 2rem",
              background: card.bg,
              color: "#fff",
              borderRadius: "0.5rem",
              minWidth: "200px",
              flex: "1 1 200px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
              {card.title}
            </h3>
            <p style={{ fontSize: "1.8rem", fontWeight: "bold" }}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
