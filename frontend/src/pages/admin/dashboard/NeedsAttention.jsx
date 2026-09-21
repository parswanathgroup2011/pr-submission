import { List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import LoadingState from "../../../components/ui/LoadingState";

export default function NeedsAttention({ pendingPrs, pendingPayments, loading }) {
  if (loading) return <LoadingState minHeight={180} label="Loading actions" />;

  const items = [
    {
      label: "Pending PRs",
      count: pendingPrs,
      to: "/admin/press-releases?status=pending",
      icon: <DescriptionOutlinedIcon fontSize="small" />,
    },
    {
      label: "Pending payment requests",
      count: pendingPayments,
      to: "/admin/manual-topups",
      icon: <UploadOutlinedIcon fontSize="small" />,
    },
  ];

  return (
    <List disablePadding>
      {items.map((item) => (
        <ListItemButton
          key={item.to}
          component={Link}
          to={item.to}
          sx={{
            borderRadius: "8px",
            mb: 0.75,
            border: "1px solid",
            borderColor: item.count > 0 ? "divider" : "transparent",
            bgcolor: item.count > 0 ? "background.default" : "transparent",
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: item.count > 0 ? "warning.main" : "text.secondary" }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            secondary={item.count > 0 ? `${item.count} waiting for review` : "None waiting"}
          />
          <Typography variant="h6" sx={{ mr: 1, color: item.count > 0 ? "text.primary" : "text.secondary" }}>
            {item.count}
          </Typography>
          <ChevronRightIcon fontSize="small" sx={{ color: "text.secondary" }} />
        </ListItemButton>
      ))}
    </List>
  );
}
