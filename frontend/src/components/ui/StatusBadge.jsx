import { Chip } from "@mui/material";

const VARIANTS = {
  pending: { label: "Pending", sx: { bgcolor: "#FEF3C7", color: "#92400E" } },
  published: { label: "Published", sx: { bgcolor: "#DCFCE7", color: "#166534" } },
  approved: { label: "Approved", sx: { bgcolor: "#DCFCE7", color: "#166534" } },
  rejected: { label: "Rejected", sx: { bgcolor: "#FEE2E2", color: "#991B1B" } },
  credit: { label: "Credit", sx: { bgcolor: "#DCFCE7", color: "#166534" } },
  debit: { label: "Debit", sx: { bgcolor: "#F1F5F9", color: "#334155" } },
  read: { label: "Read", sx: { bgcolor: "#F1F5F9", color: "#475569" } },
  unread: { label: "Unread", sx: { bgcolor: "#DBEAFE", color: "#1E40AF" } },
  single: { label: "Single", sx: { bgcolor: "#DBEAFE", color: "#1E40AF" } },
  group: { label: "Group", sx: { bgcolor: "#EDE9FE", color: "#5B21B6" } },
};

export default function StatusBadge({ status, label }) {
  const key = String(status || "pending").toLowerCase();
  const config = VARIANTS[key] || {
    label: label || status || "Unknown",
    sx: { bgcolor: "#F1F5F9", color: "#334155" },
  };

  return (
    <Chip
      size="small"
      label={label || config.label}
      sx={{ ...config.sx, fontWeight: 600, height: 24 }}
    />
  );
}
