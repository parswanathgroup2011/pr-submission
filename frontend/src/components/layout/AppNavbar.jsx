import { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import logo from "../../assets/logo.webp";
import { getMyProfile } from "../../services/authService";
import useAuthedFileUrl from "../../hooks/useAuthedFileUrl";
import { handleSuccess } from "../../utils";
import { disconnectSocket } from "../../socket";
import { useColorMode } from "./ThemeModeProvider";

function getPageTitle(pathname, items = []) {
  const matches = items
    .filter(
      (item) =>
        item.path &&
        item.action !== "logout" &&
        (pathname === item.path ||
          (item.path !== "/admin" &&
            item.path !== "/home" &&
            pathname.startsWith(item.path)))
    )
    .sort((a, b) => b.path.length - a.path.length);
  if (matches[0]?.text === "Home") return "Dashboard";
  if (matches[0]?.text) return matches[0].text;
  if (pathname.startsWith("/admin")) return "Dashboard";
  return "Dashboard";
}

function getInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function AppNavbar({
  variant = "client",
  navItems = [],
  onMenuClick,
  showBrand = true,
  position = "fixed",
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, toggleMode } = useColorMode();
  const [userAnchor, setUserAnchor] = useState(null);
  const [user, setUser] = useState({
    name: localStorage.getItem("loggedInUser") || "",
    role: localStorage.getItem("userRole") || "",
    profileImage: "",
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await getMyProfile();
        const profile = data?.user;
        if (cancelled || !profile) return;
        setUser({
          name: profile.clientName || localStorage.getItem("loggedInUser") || "",
          role: profile.role || localStorage.getItem("userRole") || "",
          profileImage: profile.profileImage || "",
        });
      } catch {
        // Keep localStorage values; do not invent identity.
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = () => {
    setUserAnchor(null);
    disconnectSocket();
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    handleSuccess(variant === "admin" ? "Admin logged out" : "User logged out");
    navigate("/login");
  };

  const profileImageUrl = useAuthedFileUrl(user.profileImage);
  const title = getPageTitle(location.pathname, navItems);
  const roleLabel = user.role === "admin" ? "Admin" : user.role === "user" ? "User" : user.role;
  const initials = getInitials(user.name);
  const avatarSrc = profileImageUrl;

  return (
    <AppBar position={position} color="inherit" elevation={0} sx={{ overflowX: "hidden", top: 0, flexShrink: 0 }}>
      <Toolbar
        sx={{
          minHeight: { xs: 64, sm: 68 },
          gap: { xs: 0.75, sm: 1.5 },
          px: { xs: 1.25, sm: 2 },
          overflow: "hidden",
        }}
      >
        {showBrand && (
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer", minWidth: 0, mr: { xs: 0.5, md: 1 } }}
            onClick={() => navigate(variant === "admin" ? "/admin" : "/home")}
          >
            <Box component="img" src={logo} alt="Times of Kashi" sx={{ height: 32, flexShrink: 0 }} />
            <Box sx={{ display: { xs: "none", sm: "block" }, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }} noWrap>
                Times of Kashi
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }} noWrap>
                Admin panel
              </Typography>
            </Box>
          </Box>
        )}

        <IconButton
          aria-label="Toggle navigation"
          onClick={onMenuClick}
          sx={{
            color: "text.primary",
            border: "none",
            width: 40,
            height: 40,
            flexShrink: 0,
            "&:hover": { backgroundColor: "action.hover" },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          sx={{ fontSize: { xs: 16, sm: 18 }, fontWeight: 650, flexShrink: 1, minWidth: 0 }}
          noWrap
        >
          {title}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
          <IconButton
            aria-label="Toggle color mode"
            onClick={toggleMode}
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "10px",
              color: "text.primary",
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            {mode === "dark" ? <LightModeOutlinedIcon sx={{ fontSize: 20 }} /> : <DarkModeOutlinedIcon sx={{ fontSize: 20 }} />}
          </IconButton>
        </Tooltip>

        <Box
          onClick={(e) => setUserAnchor(e.currentTarget)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            ml: 0.5,
            pl: 0.5,
            cursor: "pointer",
            minWidth: 0,
            flexShrink: 0,
            borderRadius: "10px",
            "&:hover": { backgroundColor: "action.hover" },
          }}
        >
          <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "right", minWidth: 0, maxWidth: 140 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }} noWrap>
              {user.name || roleLabel || "Account"}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }} noWrap>
              {roleLabel}
            </Typography>
          </Box>
          <Avatar
            src={avatarSrc || undefined}
            alt={user.name || "User"}
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {initials}
          </Avatar>
        </Box>
        <Menu
          anchorEl={userAnchor}
          open={Boolean(userAnchor)}
          onClose={() => setUserAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Box sx={{ px: 2, py: 1.25, display: { xs: "block", sm: "none" }, minWidth: 180 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {user.name || roleLabel || "Account"}
            </Typography>
            <Typography variant="caption" color="text.secondary">{roleLabel}</Typography>
          </Box>
          <Divider sx={{ display: { xs: "block", sm: "none" } }} />
          {variant === "client" && (
            <MenuItem
              onClick={() => {
                setUserAnchor(null);
                navigate("/profile");
              }}
            >
              <AccountCircleOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
              My profile
            </MenuItem>
          )}
          {variant === "client" && <Divider />}
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
