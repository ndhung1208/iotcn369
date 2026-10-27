import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Slider,
  Snackbar,
  Switch,
  Typography,
} from "@mui/material";

import ThermostatRoundedIcon from "@mui/icons-material/ThermostatRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";

// ============================================================
// TYPES
// ============================================================

interface Device {
  id: number;
  deviceCode: string;
  deviceName: string;
  location: string;
  status: "ONLINE" | "OFFLINE";
  currentState: "ON" | "OFF";
}

interface DeviceSettings {
  temperatureMin: number;
  temperatureMax: number;
  humidityMin: number;
  humidityMax: number;
  lightThreshold: number;
}

// ============================================================
// MOCK DEVICES
// ============================================================

const initialDevices: Device[] = [
  {
    id: 1,
    deviceCode: "IOT-001",
    deviceName: "Thiết bị phòng khách",
    location: "Phòng khách",
    status: "ONLINE",
    currentState: "ON",
  },
  {
    id: 2,
    deviceCode: "IOT-002",
    deviceName: "Thiết bị phòng ngủ",
    location: "Phòng ngủ",
    status: "ONLINE",
    currentState: "OFF",
  },
  {
    id: 3,
    deviceCode: "IOT-003",
    deviceName: "Thiết bị nhà bếp",
    location: "Nhà bếp",
    status: "OFFLINE",
    currentState: "OFF",
  },
  {
    id: 4,
    deviceCode: "IOT-004",
    deviceName: "Thiết bị ban công",
    location: "Ban công",
    status: "ONLINE",
    currentState: "ON",
  },
];

// ============================================================
// MOCK SETTINGS
// MỖI DEVICE CÓ NGƯỠNG RIÊNG
// ============================================================

const initialSettings: Record<number, DeviceSettings> = {
  1: {
    temperatureMin: 20,
    temperatureMax: 35,
    humidityMin: 40,
    humidityMax: 80,
    lightThreshold: 300,
  },

  2: {
    temperatureMin: 18,
    temperatureMax: 30,
    humidityMin: 45,
    humidityMax: 75,
    lightThreshold: 200,
  },

  3: {
    temperatureMin: 22,
    temperatureMax: 32,
    humidityMin: 50,
    humidityMax: 85,
    lightThreshold: 500,
  },

  4: {
    temperatureMin: 15,
    temperatureMax: 35,
    humidityMin: 35,
    humidityMax: 70,
    lightThreshold: 400,
  },
};

// ============================================================
// COMPONENT
// ============================================================

export default function DeviceSetting() {
  const [devices, setDevices] =
    useState<Device[]>(initialDevices);

  const [settings, setSettings] =
    useState<Record<number, DeviceSettings>>(
      initialSettings
    );

  // Thiết bị đang được chọn
  const [selectedDeviceId, setSelectedDeviceId] =
    useState<number>(initialDevices[0].id);

  const [openSnackbar, setOpenSnackbar] =
    useState(false);

  // ==========================================================
  // SELECTED DEVICE
  // ==========================================================

  const selectedDevice = devices.find(
    (device) => device.id === selectedDeviceId
  );

  const selectedSettings =
    settings[selectedDeviceId];

  if (!selectedDevice || !selectedSettings) {
    return null;
  }

  // ==========================================================
  // UPDATE THRESHOLD
  // ==========================================================

  const updateSettings = (
    changes: Partial<DeviceSettings>
  ) => {
    setSettings((prev) => ({
      ...prev,

      [selectedDeviceId]: {
        ...prev[selectedDeviceId],
        ...changes,
      },
    }));
  };

  // ==========================================================
  // TOGGLE DEVICE
  // ==========================================================

  const toggleDevice = (deviceId: number) => {
    setDevices((prev) =>
      prev.map((device) => {
        if (device.id !== deviceId) {
          return device;
        }

        // Không cho bật thiết bị offline
        if (
          device.status === "OFFLINE" &&
          device.currentState === "OFF"
        ) {
          return device;
        }

        return {
          ...device,
          currentState:
            device.currentState === "ON"
              ? "OFF"
              : "ON",
        };
      })
    );
  };

  // ==========================================================
  // SAVE SETTINGS
  // ==========================================================

  const handleSave = () => {
    console.log(
      "Device:",
      selectedDevice
    );

    console.log(
      "Settings:",
      selectedSettings
    );

    setOpenSnackbar(true);
  };

  const isOnline =
    selectedDevice.status === "ONLINE";

  const isDeviceOn =
    selectedDevice.currentState === "ON";

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* ======================================================
          HEADER
         ====================================================== */}

      <Box sx={{ mb: 2, flexShrink: 0 }}>
        <Typography
          variant="h5"
          fontWeight={800}
          sx={{ mb: 0.5 }}
        >
          Cài đặt thiết bị
        </Typography>

        <Typography color="text.secondary">
          Quản lý trạng thái và thiết lập ngưỡng
          cảnh báo cho từng thiết bị
        </Typography>
      </Box>

      <Grid
        container
        spacing={3}
        alignItems="stretch"
        sx={{ flex: 1, overflow: "auto", minHeight: 0, alignContent: "flex-start" }}
      >
        {/* ====================================================
            DEVICE LIST
           ==================================================== */}

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={styles.card}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 2.5 }}>
                <Typography
                  variant="h6"
                  fontWeight={800}
                >
                  Danh sách thiết bị
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {devices.length} thiết bị
                </Typography>
              </Box>

              <Divider />

              <List disablePadding>
                {devices.map((device) => {
                  const isSelected =
                    device.id ===
                    selectedDeviceId;

                  const isOn =
                    device.currentState ===
                    "ON";

                  const online =
                    device.status ===
                    "ONLINE";

                  return (
                    <ListItemButton
                      key={device.id}
                      selected={isSelected}
                      onClick={() =>
                        setSelectedDeviceId(
                          device.id
                        )
                      }
                      sx={{
                        px: 2.5,
                        py: 2,
                        borderBottom:
                          "1px solid",
                        borderColor:
                          "divider",

                        "&.Mui-selected": {
                          bgcolor:
                            "primary.50",
                        },

                        "&.Mui-selected:hover": {
                          bgcolor:
                            "primary.100",
                        },
                      }}
                    >
                      {/* DEVICE ICON */}

                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          bgcolor: isOn
                            ? "warning.50"
                            : "grey.100",
                          mr: 1.5,
                          flexShrink: 0,
                        }}
                      >
                        <MemoryRoundedIcon
                          color={
                            isOn
                              ? "warning"
                              : "disabled"
                          }
                        />
                      </Box>

                      {/* DEVICE INFO */}

                      <ListItemText
                        primary={
                          <Typography
                            fontWeight={700}
                            fontSize={14}
                          >
                            {device.deviceName}
                          </Typography>
                        }
                        secondary={
                          <Box
                            sx={{
                              mt: 0.5,
                              display: "flex",
                              flexDirection:
                                "column",
                              gap: 0.5,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {
                                device.deviceCode
                              }
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {
                                device.location
                              }
                            </Typography>
                          </Box>
                        }
                      />

                      {/* STATUS */}

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection:
                            "column",
                          alignItems:
                            "flex-end",
                          gap: 0.5,
                        }}
                      >
                        <Chip
                          size="small"
                          label={
                            isOn
                              ? "ON"
                              : "OFF"
                          }
                          color={
                            isOn
                              ? "success"
                              : "default"
                          }
                          sx={{
                            minWidth: 50,
                          }}
                        />

                        <Typography
                          variant="caption"
                          color={
                            online
                              ? "success.main"
                              : "text.disabled"
                          }
                        >
                          {online
                            ? "Online"
                            : "Offline"}
                        </Typography>
                      </Box>
                    </ListItemButton>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* ====================================================
            DEVICE SETTINGS
           ==================================================== */}

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={styles.card}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              {/* DEVICE HEADER */}

              <Box sx={styles.deviceHeader}>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                  >
                    {selectedDevice.deviceName}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {selectedDevice.deviceCode}
                    {" • "}
                    {selectedDevice.location}
                  </Typography>
                </Box>

                <Chip
                  label={
                    isOnline
                      ? "ONLINE"
                      : "OFFLINE"
                  }
                  color={
                    isOnline
                      ? "success"
                      : "default"
                  }
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* ==================================================
                  MANUAL CONTROL
                 ================================================== */}

              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={800}
                  sx={{ mb: 2 }}
                >
                  Điều khiển thiết bị
                </Typography>

                <Box sx={styles.controlBox}>
                  <Box
                    sx={{
                      ...styles.iconBox,
                      bgcolor: isDeviceOn
                        ? "warning.50"
                        : "grey.100",
                    }}
                  >
                    <LightbulbRoundedIcon
                      sx={{
                        fontSize: 30,
                        color: isDeviceOn
                          ? "warning.main"
                          : "text.disabled",
                      }}
                    />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      fontWeight={800}
                    >
                      Trạng thái thiết bị
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {isDeviceOn
                        ? "Thiết bị đang hoạt động"
                        : "Thiết bị đang tắt"}
                    </Typography>
                  </Box>

                  <Switch
                    checked={isDeviceOn}
                    disabled={!isOnline}
                    onChange={() =>
                      toggleDevice(
                        selectedDevice.id
                      )
                    }
                  />
                </Box>

                {!isOnline && (
                  <Alert
                    severity="warning"
                    sx={{ mt: 2 }}
                  >
                    Thiết bị đang offline,
                    không thể điều khiển.
                  </Alert>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* ==================================================
                  TEMPERATURE
                 ================================================== */}

              <ThresholdSection
                icon={
                  <ThermostatRoundedIcon color="primary" />
                }
                title="Nhiệt độ"
                min={0}
                max={50}
                value={[
                  selectedSettings.temperatureMin,
                  selectedSettings.temperatureMax,
                ]}
                unit="°C"
                onChange={(value) =>
                  updateSettings({
                    temperatureMin:
                      value[0],
                    temperatureMax:
                      value[1],
                  })
                }
              />

              <Divider sx={{ my: 3 }} />

              {/* ==================================================
                  HUMIDITY
                 ================================================== */}

              <ThresholdSection
                icon={
                  <WaterDropRoundedIcon color="primary" />
                }
                title="Độ ẩm"
                min={0}
                max={100}
                value={[
                  selectedSettings.humidityMin,
                  selectedSettings.humidityMax,
                ]}
                unit="%"
                onChange={(value) =>
                  updateSettings({
                    humidityMin:
                      value[0],
                    humidityMax:
                      value[1],
                  })
                }
              />

              <Divider sx={{ my: 3 }} />

              {/* ==================================================
                  LIGHT
                 ================================================== */}

              <Box>
                <Box sx={styles.sensorTitle}>
                  <WbSunnyRoundedIcon color="primary" />

                  <Typography fontWeight={700}>
                    Ánh sáng
                  </Typography>
                </Box>

                <Slider
                  value={
                    selectedSettings.lightThreshold
                  }
                  min={0}
                  max={1000}
                  step={10}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) =>
                    `${value} lux`
                  }
                  onChange={(_, value) =>
                    updateSettings({
                      lightThreshold:
                        value as number,
                    })
                  }
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Ngưỡng cảnh báo:{" "}
                  <strong>
                    {
                      selectedSettings.lightThreshold
                    }{" "}
                    lux
                  </strong>
                </Typography>
              </Box>

              {/* ==================================================
                  SAVE
                 ================================================== */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "flex-end",
                  mt: 4,
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSave}
                  sx={{
                    minWidth: 150,
                    borderRadius: 2,
                    fontWeight: 700,
                  }}
                >
                  Lưu cài đặt
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ========================================================
          SNACKBAR
         ======================================================== */}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() =>
          setOpenSnackbar(false)
        }
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() =>
            setOpenSnackbar(false)
          }
        >
          Đã lưu cài đặt cho{" "}
          {selectedDevice.deviceName}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// ================================================================
// THRESHOLD SECTION
// ================================================================

interface ThresholdSectionProps {
  icon: React.ReactNode;
  title: string;
  min: number;
  max: number;
  value: [number, number];
  unit: string;
  onChange: (value: [number, number]) => void;
}

function ThresholdSection({
  icon,
  title,
  min,
  max,
  value,
  unit,
  onChange,
}: ThresholdSectionProps) {
  return (
    <Box>
      <Box sx={styles.sensorTitle}>
        {icon}

        <Typography fontWeight={700}>
          {title}
        </Typography>
      </Box>

      <Slider
        value={value}
        min={min}
        max={max}
        step={1}
        disableSwap
        valueLabelDisplay="auto"
        valueLabelFormat={(value) =>
          `${value} ${unit}`
        }
        onChange={(_, newValue) =>
          onChange(
            newValue as [number, number]
          )
        }
      />

      <Box sx={styles.rangeText}>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Tối thiểu:{" "}
          <strong>
            {value[0]} {unit}
          </strong>
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Tối đa:{" "}
          <strong>
            {value[1]} {unit}
          </strong>
        </Typography>
      </Box>
    </Box>
  );
}

// ================================================================
// STYLES
// ================================================================

const styles = {
  card: {
    borderRadius: 3,
    boxShadow:
      "0 6px 24px rgba(15, 23, 42, 0.06)",
  },

  deviceHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    flexWrap: "wrap",
  },

  sensorTitle: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 1,
  },

  rangeText: {
    display: "flex",
    justifyContent: "space-between",
    gap: 2,
  },

  controlBox: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    p: 2.5,
    borderRadius: 3,
    bgcolor: "grey.50",
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
};

