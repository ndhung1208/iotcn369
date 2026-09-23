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

const drawerWidth = 250;

const navItems = [
  { label: "Dashboard", path: "/", icon: <DashboardRoundedIcon /> },
  { label: "Dữ liệu cảm biến", path: "/sensors", icon: <SensorsRoundedIcon /> },
  { label: "Lịch sử thiết bị", path: "/device-history", icon: <HistoryRoundedIcon /> },
  { label: "Thông tin cá nhân", path: "/profile", icon: <PersonRoundedIcon /> },
  { label: "Cài đặt thiết bị", path: "/device-setting", icon: <SettingsRoundedIcon /> },
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
      <Box sx={{ px: 2.5, py: 2.4, display: "flex", gap: 1.5, alignItems: "center" }}>
        <Avatar sx={{ bgcolor: "primary.main" }}><CloudDoneRoundedIcon /></Avatar>
        <Box>
          <Typography fontWeight={800}>IoT Monitor</Typography>
          <Typography variant="caption" color="text.secondary">ESP32-C3 Mini</Typography>
        </Box>
      </Box>

      <List sx={{ px: 1.5 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            sx={{
              mb: .7, borderRadius: 2,
              "&.active": { bgcolor: "primary.main", color: "white", "& .MuiListItemIcon-root": { color: "white" } }
            }}
          >
            <ListItemIcon sx={{ minWidth: 42 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ mt: "auto", p: 2 }}>
        <Box sx={{ p: 1.6, bgcolor: "#f0fdf4", borderRadius: 3 }}>
          <Typography variant="caption" color="success.main" fontWeight={700}>● Hệ thống đang hoạt động</Typography>
          <Typography variant="body2" sx={{ mt: .5 }} color="text.secondary">
            Kết nối ESP32 và cảm biến
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: "1px solid #e5e7eb", zIndex: 1201 }}>
        <Toolbar sx={{ minHeight: "68px !important" }}>
          {isMobile && <IconButton onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}><MenuRoundedIcon /></IconButton>}
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={800}>{title}</Typography>
            <Typography variant="caption" color="text.secondary">Hệ thống giám sát môi trường IoT</Typography>
          </Box>
          <Avatar sx={{ width: 36, height: 36 }}>A</Avatar>
        </Toolbar>
      </AppBar>

      {!isMobile && <Drawer variant="permanent" sx={{ width: drawerWidth, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", borderRight: "1px solid #e5e7eb" } }}>{drawer}</Drawer>}
      {isMobile && <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ "& .MuiDrawer-paper": { width: drawerWidth } }}>{drawer}</Drawer>}

      <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3.5 }, mt: "68px", overflow: "hidden" }}>
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