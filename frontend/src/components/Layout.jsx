import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AppShell from "./layout/AppShell";

const clientNav = [
  { text: "Home", icon: <DashboardIcon />, path: "/home" },
  { text: "Press Releases", icon: <PostAddIcon />, path: "/press-release" },
  { text: "Plans", icon: <AccountBalanceWalletIcon />, path: "/plans" },
  { text: "Transactions", icon: <ReceiptIcon />, path: "/transactions" },
  { text: "Notifications", icon: <NotificationsIcon />, path: "/notifications" },
  { text: "My Profile", icon: <AccountBoxIcon />, path: "/profile" },
];

export default function Layout() {
  return <AppShell variant="client" navItems={clientNav} />;
}
