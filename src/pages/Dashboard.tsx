import { useState } from "react";
import { Box, Grid, Typography, Switch } from "@mui/material";
import ThermostatRoundedIcon from "@mui/icons-material/ThermostatRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";

import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import { sensorRecords } from "../data/mockData";

export default function Dashboard() {
  // ============================================================
  // LED STATES
  // ============================================================

  const [led1On, setLed1On] = useState(false);
  const [led2On, setLed2On] = useState(false);
  const [led3On, setLed3On] = useState(false);

  // ============================================================
  // LATEST SENSOR DATA
  // ============================================================

  const latest = sensorRecords.at(-1);

  if (!latest) {
    return (
      <Box>
        <Typography variant="h5" fontWeight={800}>
          Không có dữ liệu cảm biến
        </Typography>
      </Box>
    );
  }

  // ============================================================
  // CHART DATA
  // ============================================================

  const recentData = sensorRecords.slice(-20);

  const chartData = recentData.map(
    ({ recordedAt, temperature, humidity, light }) => ({
      time: recordedAt.split(" ")[1]?.slice(0, 5) || "",
      temperature,
      humidity,
      light,
    })
  );

  // ============================================================
  // SENSOR STATISTICS
  // ============================================================

  const stats = [
    {
      title: "Nhiệt độ",
      value: latest.temperature.toFixed(1),
      unit: "°C",
      icon: <ThermostatRoundedIcon />,
      description: "Giá trị gần nhất",
    },
    {
      title: "Độ ẩm",
      value: latest.humidity.toFixed(1),
      unit: "%",
      icon: <WaterDropRoundedIcon />,
      description: "Giá trị gần nhất",
    },
    {
      title: "Ánh sáng",
      value: latest.light.toFixed(0),
      unit: "lux",
      icon: <WbSunnyRoundedIcon />,
      description: "Giá trị gần nhất",
    },
  ];

  // ============================================================
  // LED DATA
  // ============================================================

  const leds = [
    {
      id: 1,
      name: "LED 1",
      isOn: led1On,
      setState: setLed1On,
    },
    {
      id: 2,
      name: "LED 2",
      isOn: led2On,
      setState: setLed2On,
    },
    {
      id: 3,
      name: "LED 3",
      isOn: led3On,
      setState: setLed3On,
    },
  ];

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Box>
      {/* ========================================================
          HEADER
         ======================================================== */}

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          fontWeight={800}
          sx={{ mb: 0.5 }}
        >
          Tổng quan hệ thống
        </Typography>

        <Typography color="text.secondary">
          Theo dõi nhiệt độ, độ ẩm và ánh sáng theo thời gian thực
        </Typography>
      </Box>

      <Grid container spacing={2.2}>
        {/* ======================================================
            SENSOR STAT CARDS
           ====================================================== */}

        {stats.map((stat) => (
          <Grid
            key={stat.title}
            size={{ xs: 12, md: 4 }}
          >
            <StatCard {...stat} />
          </Grid>
        ))}

        {/* ======================================================
            SENSOR CHART
           ====================================================== */}

        <Grid size={{ xs: 12 }}>
          <ChartCard
            title="Nhiệt độ, độ ẩm và ánh sáng - 20 giá trị gần nhất"
            data={chartData}
          />
        </Grid>

        {/* ======================================================
            LED CONTROL
           ====================================================== */}

        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 3,
              p: 2.5,
              boxShadow:
                "0 6px 24px rgba(15,23,42,.06)",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{ mb: 2 }}
            >
              Điều khiển LED
            </Typography>

            <Grid container spacing={2}>
              {leds.map((led) => (
                <Grid
                  key={led.id}
                  size={{ xs: 12, sm: 4 }}
                >
                  <Box
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 3,
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    {/* LED ICON */}

                    <LightbulbRoundedIcon
                      sx={{
                        fontSize: 32,
                        color: led.isOn
                          ? "warning.main"
                          : "text.disabled",
                      }}
                    />

                    {/* LED INFO */}

                    <Box sx={{ flex: 1 }}>
                      <Typography
                        fontWeight={800}
                      >
                        {led.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {led.isOn
                          ? "Đang bật"
                          : "Đang tắt"}
                      </Typography>
                    </Box>

                    {/* SWITCH */}

                    <Switch
                      checked={led.isOn}
                      onChange={(event) =>
                        led.setState(
                          event.target.checked
                        )
                      }
                      color="warning"
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

