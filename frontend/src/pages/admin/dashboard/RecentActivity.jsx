import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import EmptyState from "../../../components/ui/EmptyState";
import LoadingState from "../../../components/ui/LoadingState";
import { relativeTimeFrom } from "./dashboardUtils";

const ICONS = {
  pr_submitted: { icon: <DescriptionOutlinedIcon fontSize="small" />, color: "primary.main" },
  pr_published: { icon: <CheckCircleOutlineIcon fontSize="small" />, color: "success.main" },
  pr_rejected: { icon: <CancelOutlinedIcon fontSize="small" />, color: "error.main" },
  payment_approved: { icon: <PaymentsOutlinedIcon fontSize="small" />, color: "success.main" },
  payment_rejected: { icon: <CancelOutlinedIcon fontSize="small" />, color: "error.main" },
};

export default function RecentActivity({ items, loading }) {
  if (loading) return <LoadingState minHeight={180} label="Loading activity" />;
  if (!items.length) {
    return (
      <EmptyState
        title="No recent activity"
        description="Approved payments and press release decisions will appear here."
      />
    );
  }

  return (
    <List disablePadding>
      {items.map((item) => {
        const visual = ICONS[item.type] || ICONS.pr_submitted;
        return (
          <ListItem key={item.id} alignItems="flex-start" sx={{ px: 0, py: 1.25 }}>
            <ListItemIcon sx={{ minWidth: 36, mt: 0.5, color: visual.color }}>
              {visual.icon}
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, alignItems: "baseline" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                    {relativeTimeFrom(item.at)}
                  </Typography>
                </Box>
              }
              secondary={item.description}
            />
          </ListItem>
        );
      })}
    </List>
  );
}
