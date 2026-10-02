import { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { connectSocket } from "../../socket";
import AppDrawer from "./AppDrawer";
import ClientDrawer from "./ClientDrawer";
import AppNavbar from "./AppNavbar";

export default function AppShell({ navItems, variant = "client" }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  const handleMenuClick = () => {
    if (isMobile) setMobileOpen(true);
    else setDesktopCollapsed((current) => !current);
  };

  useEffect(() => {
    const current = connectSocket();
    if (!current) return undefined;
    const listener = (data) => {
      toast.info(
        variant === "admin"
          ? `Admin Alert: ${data.title}`
          : `${data.title}: ${data.message}`,
        { position: "top-right" }
      );
    };
    current.on("newNotification", listener);
    return () => current.off("newNotification", listener);
  }, [variant]);

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {variant === "admin" ? (
        <AppDrawer
          items={navItems}
          variant="admin"
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          collapsed={!isMobile && desktopCollapsed}
        />
      ) : (
        <ClientDrawer
          items={navItems}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          collapsed={!isMobile && desktopCollapsed}
        />
      )}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <AppNavbar
          variant={variant}
          navItems={navItems}
          onMenuClick={handleMenuClick}
          showBrand={false}
          position="relative"
        />
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: "auto",
            backgroundColor: "background.default",
            p: { xs: 2, sm: 3 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
