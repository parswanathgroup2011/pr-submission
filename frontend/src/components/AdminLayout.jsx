import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import UploadIcon from "@mui/icons-material/Upload";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import AppShell from "./layout/AppShell";

const adminNav = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
  { text: "Press Releases", icon: <DescriptionIcon />, path: "/admin/press-releases" },
  { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
  { text: "Transactions", icon: <ReceiptIcon />, path: "/admin/transactions" },
  { text: "Wallets", icon: <AccountBalanceWalletIcon />, path: "/admin/wallets" },
  { text: "Payment Requests", icon: <UploadIcon />, path: "/admin/manual-topups" },
  { text: "Notifications", icon: <NotificationsIcon />, path: "/admin/notifications" },
  { text: "Logout", icon: <LogoutIcon />, action: "logout" },
];

export default function AdminLayout() {
  return <AppShell variant="admin" navItems={adminNav} />;
}
