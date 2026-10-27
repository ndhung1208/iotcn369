import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Switch,
  Paper,
  CircularProgress,
} from "@mui/material";
import ThermostatOutlinedIcon from "@mui/icons-material/ThermostatOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";

import ChartCard from "../components/ChartCard";
import { sensorRecords } from "../data/mockData";

export default function Dashboard() {
  const [led1On, setLed1On] = useState(false);
  const [led2On, setLed2On] = useState(false);
  const [led3On, setLed3On] = useState(false);

  // State lưu trạng thái loading riêng cho từng đèn
  const [loadingLeds, setLoadingLeds] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
  });

  const latest = sensorRecords.at(-1);

  if (!latest) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="text.secondary">Không có dữ liệu cảm biến</Typography>
      </Box>
    );
  }

  const recentData = sensorRecords.slice(-20);
  const chartData = recentData.map(
    ({ recordedAt, temperature, humidity, light }) => ({
      time: recordedAt.split(" ")[1]?.slice(0, 5) || "",
      temperature,
      humidity,
      light,
    })
  );

  // Hàm xử lý bật/tắt kèm delay 0.5s
  const handleToggleLed = (
    id: number,
    nextChecked: boolean,
    setState: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    // Bắt đầu loading cho đèn được bấm
    setLoadingLeds((prev) => ({ ...prev, [id]: true }));

    setTimeout(() => {
      setState(nextChecked);
      // Tắt loading sau 500ms (0.5s)
      setLoadingLeds((prev) => ({ ...prev, [id]: false }));
    }, 500);
  };

  const leds = [
    { id: 1, name: "Led 1", isOn: led1On, setState: setLed1On },
    { id: 2, name: "Led 2", isOn: led2On, setState: setLed2On },
    { id: 3, name: "Led 3", isOn: led3On, setState: setLed3On },
  ];

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        overflow: "hidden",
      }}
    >
      {/* HEADER SECTION */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexShrink: 0 }}>
        <Box>
          <Typography variant="h5" sx={{ color: "#0f172a" }}>
            Tổng quan hệ thống
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
            Cập nhật lần cuối lúc {latest.recordedAt}
          </Typography>
        </Box>
      </Box>

      {/* TOP ROW: STATS & QUICK INFO */}
      <Grid container spacing={1.5} sx={{ flexShrink: 0 }}>
        {/* TEMPERATURE */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              border: "1px solid #e2e8f0",
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              bgcolor: "#ffffff",
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                bgcolor: "#fef2f2",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ThermostatOutlinedIcon fontSize="small" />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="body2" color="text.secondary" noWrap>
                Nhiệt độ
              </Typography>
              <Typography variant="h6" sx={{ color: "#0f172a", lineHeight: 1.2 }}>
                {latest.temperature.toFixed(1)} <Typography component="span" variant="body2" color="text.secondary">°C</Typography>
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* HUMIDITY */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              border: "1px solid #e2e8f0",
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              bgcolor: "#ffffff",
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                bgcolor: "#eff6ff",
                color: "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <WaterDropOutlinedIcon fontSize="small" />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="body2" color="text.secondary" noWrap>
                Độ ẩm
              </Typography>
              <Typography variant="h6" sx={{ color: "#0f172a", lineHeight: 1.2 }}>
                {latest.humidity.toFixed(1)} <Typography component="span" variant="body2" color="text.secondary">%</Typography>
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* LIGHT */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              border: "1px solid #e2e8f0",
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              bgcolor: "#ffffff",
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                bgcolor: "#fffbeb",
                color: "#d97706",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <WbSunnyOutlinedIcon fontSize="small" />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="body2" color="text.secondary" noWrap>
                Ánh sáng
              </Typography>
              <Typography variant="h6" sx={{ color: "#0f172a", lineHeight: 1.2 }}>
                {latest.light.toFixed(0)} <Typography component="span" variant="body2" color="text.secondary">lux</Typography>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* MIDDLE: CHART */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ChartCard
          title="Biểu đồ quan trắc theo thời gian (20 mẫu gần nhất)"
          data={chartData}
        />
      </Box>

      {/* BOTTOM ROW: DEVICE CONTROLS */}
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          border: "1px solid #e2e8f0",
          borderRadius: 2.5,
          bgcolor: "#ffffff",
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" fontWeight={600} color="#0f172a">
            Điều khiển thiết bị
          </Typography>
          <Typography variant="caption" color="text.secondary">
            3 công tắc khả dụng
          </Typography>
        </Box>

        <Grid container spacing={1.5}>
          {leds.map((led) => {
            const isLoading = loadingLeds[led.id];

            return (
              <Grid key={led.id} size={{ xs: 12, sm: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 1.5,
                    py: 0.8,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: led.isOn ? "#fed7aa" : "#f1f5f9",
                    bgcolor: led.isOn ? "#fffbeb" : "#f8fafc",
                    transition: "all 0.2s ease",
                    opacity: isLoading ? 0.8 : 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LightbulbOutlinedIcon
                      sx={{
                        fontSize: 20,
                        color: led.isOn ? "#d97706" : "#94a3b8",
                      }}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight={500} color="#1e293b">
                        {led.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color={
                          isLoading
                            ? "text.secondary"
                            : led.isOn
                            ? "warning.main"
                            : "text.secondary"
                        }
                      >
                        {isLoading
                          ? "Đang xử lý..."
                          : led.isOn
                          ? "Đang bật"
                          : "Đang tắt"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Hiển thị icon xoay loading kèm công tắc bị khóa khi đang xử lý */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {isLoading && (
                      <CircularProgress size={16} color="warning" thickness={5} />
                    )}
                    <Switch
                      size="small"
                      checked={led.isOn}
                      disabled={isLoading}
                      onChange={(e) =>
                        handleToggleLed(led.id, e.target.checked, led.setState)
                      }
                      color="warning"
                    />
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Box>
  );
}