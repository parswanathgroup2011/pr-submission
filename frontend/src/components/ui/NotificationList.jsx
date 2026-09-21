import { Box, Paper, List, ListItem, ListItemText } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import PageHeader from "./PageHeader";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import ActionIconButton from "./ActionIconButton";
import StatusBadge from "./StatusBadge";

export default function NotificationList({ title, description, items, loading, onMarkRead, backTo }) {
  return (
    <Box>
      <PageHeader title={title} description={description} showBack backTo={backTo} />
      <Paper elevation={1} sx={{ borderRadius: "12px", overflow: "hidden" }}>
        {loading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <EmptyState title="No notifications" description="You are all caught up." />
        ) : (
          <List disablePadding>
            {items.map((item) => (
              <ListItem
                key={item._id}
                divider
                sx={{
                  bgcolor: item.isRead ? "background.paper" : "rgba(27, 81, 189, 0.04)",
                  py: 1.5,
                }}
                secondaryAction={
                  !item.isRead && (
                    <ActionIconButton title="Mark as read" onClick={() => onMarkRead(item._id)}>
                      <MarkEmailReadIcon fontSize="small" />
                    </ActionIconButton>
                  )
                }
              >
                <NotificationsNoneIcon sx={{ mr: 2, color: "primary.main" }} />
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {item.title}
                      <StatusBadge status={item.isRead ? "read" : "unread"} />
                    </Box>
                  }
                  secondary={item.message}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
