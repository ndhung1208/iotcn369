import { useMemo, useState } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import {
  AppBar, Avatar, Box, Drawer, IconButton, List, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Typography, useMediaQuery
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloudDoneRoundedIcon from "@mui/icons-material/CloudDoneRounded";
import Dashboard from "./pages/Dashboard";
import SensorData from "./pages/SensorData";
import DeviceHistory from "./pages/DeviceHistory";
import Profile from "./pages/Profile";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded"; // Import icon mới
import DeviceSetting from "./pages/DeviceSetting"; // Import trang mới

const drawerWidth = 240;

const navItems = [
  { label: "Dashboard", path: "/", icon: <DashboardRoundedIcon fontSize="small" /> },
  { label: "Dữ liệu cảm biến", path: "/sensors", icon: <SensorsRoundedIcon fontSize="small" /> },
  { label: "Lịch sử thiết bị", path: "/device-history", icon: <HistoryRoundedIcon fontSize="small" /> },
  { label: "Thông tin cá nhân", path: "/profile", icon: <PersonRoundedIcon fontSize="small" /> },
  { label: "Cài đặt thiết bị", path: "/device-setting", icon: <SettingsRoundedIcon fontSize="small" /> },
];

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");
  const location = useLocation();

  const title = useMemo(() => {
    return navItems.find((x) => x.path === location.pathname)?.label ?? "IoT Dashboard";
  }, [location.pathname]);

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2.5, py: 2, display: "flex", gap: 1.5, alignItems: "center", borderBottom: "1px solid #f1f5f9" }}>
        <Avatar sx={{ bgcolor: "#2563eb", width: 34, height: 34 }}>
          <CloudDoneRoundedIcon fontSize="small" />
        </Avatar>
        <Box>
          <Typography fontWeight={700} fontSize={15} color="#0f172a">
            IoT Monitor
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ESP32-C3
          </Typography>
        </Box>
      </Box>

      <List sx={{ px: 1.5, py: 1.5 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            sx={{
              mb: 0.5,
              borderRadius: 2,
              py: 0.8,
              color: "#475569",
              "&.active": {
                bgcolor: "#eff6ff",
                color: "#2563eb",
                fontWeight: 600,
                "& .MuiListItemIcon-root": { color: "#2563eb" },
              },
              "&:hover": {
                bgcolor: "#f8fafc",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontSize: 13.5, fontWeight: "inherit" }}
            />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ mt: "auto", p: 2 }}>
        <Box sx={{ p: 1.5, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0" }}>
          <Typography variant="caption" color="#16a34a" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#16a34a" }} />
            ESP32 Online
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
            Dữ liệu đồng bộ theo chu kỳ
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: "1px solid #e2e8f0",
          zIndex: 1201,
          bgcolor: "#ffffff",
        }}
      >
        <Toolbar sx={{ minHeight: "56px !important", height: 56, px: { xs: 2, md: 3 } }}>
          {isMobile && (
            <IconButton onClick={() => setMobileOpen(true)} sx={{ mr: 1 }} size="small">
              <MenuRoundedIcon fontSize="small" />
            </IconButton>
          )}
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={700} fontSize={16} color="#0f172a">
              {title}
            </Typography>
          </Box>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "#e2e8f0", color: "#475569", fontSize: 13, fontWeight: 600 }}>
            AD
          </Avatar>
        </Toolbar>
      </AppBar>

      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid #e2e8f0",
              bgcolor: "#ffffff",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
      {isMobile && (
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{ "& .MuiDrawer-paper": { width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flex: 1,
          p: { xs: 1.5, md: 2.5 },
          mt: "56px",
          height: "calc(100vh - 56px)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#f8fafc",
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sensors" element={<SensorData />} />
          <Route path="/device-history" element={<DeviceHistory />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/device-setting" element={<DeviceSetting />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default function App() {
  return <Layout />;
}