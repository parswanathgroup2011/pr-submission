import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AppShell from "./layout/AppShell";

const clientNav = [
  { text: "Home", icon: <DashboardOutlinedIcon />, path: "/home" },
  { text: "Press Releases", icon: <DescriptionOutlinedIcon />, path: "/press-release" },
  { text: "Plans", icon: <AccountBalanceWalletOutlinedIcon />, path: "/plans" },
  { text: "Transactions", icon: <ReceiptOutlinedIcon />, path: "/transactions" },
  { text: "Notifications", icon: <NotificationsOutlinedIcon />, path: "/notifications", section: "account" },
  { text: "My Profile", icon: <AccountCircleOutlinedIcon />, path: "/profile", section: "account" },
  { text: "Logout", icon: <LogoutOutlinedIcon />, action: "logout" },
];

export default function Layout() {
  return <AppShell variant="client" navItems={clientNav} />;
}
