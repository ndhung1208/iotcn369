import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Pagination,
  InputAdornment,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import { sensorRecords } from "../data/mockData";

const ROWS_PER_PAGE_OPTIONS = [10, 15, 25, 50];

const parseDate = (dateString: string) =>
  new Date(dateString.replace(" ", "T"));

type SensorFilter = "all" | "Nhiệt độ" | "Độ ẩm" | "Ánh sáng" | "Thời gian";

type SensorType = "Nhiệt độ" | "Độ ẩm" | "Ánh sáng";

type SensorRow = {
  id: number;
  recordedAt: string;
  sensorType: SensorType;
  value: number;
  unit: string;
};

export default function SensorData() {
  const [search, setSearch] = useState("");
  const [sensorFilter, setSensorFilter] = useState<SensorFilter>("all");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // =========================
  // CHUYỂN DỮ LIỆU
  // =========================

  const sensorRows = useMemo<SensorRow[]>(() => {
    const rows: SensorRow[] = [];

    sensorRecords.forEach((record) => {
      rows.push({
        id: rows.length + 1,
        recordedAt: record.recordedAt,
        sensorType: "Nhiệt độ",
        value: record.temperature,
        unit: "°C",
      });

      rows.push({
        id: rows.length + 1,
        recordedAt: record.recordedAt,
        sensorType: "Độ ẩm",
        value: record.humidity,
        unit: "%",
      });

      rows.push({
        id: rows.length + 1,
        recordedAt: record.recordedAt,
        sensorType: "Ánh sáng",
        value: record.light,
        unit: "lux",
      });
    });

    return rows;
  }, []);

  // =========================
  // TÌM KIẾM THEO TIÊU CHÍ ĐÃ CHỌN
  // =========================

  const rows = useMemo(() => {
    let result = [...sensorRows];

    // Sắp xếp theo thời gian mới nhất
    result.sort(
      (a, b) =>
        parseDate(b.recordedAt).getTime() - parseDate(a.recordedAt).getTime()
    );

    // CHỈ LỌC KHI CÓ TỪ KHÓA NHẬP VÀO Ô TÌM KIẾM
    const keyword = search.trim().toLowerCase();
    if (keyword) {
      if (sensorFilter === "Thời gian") {
        // Tiêu chí Thời gian: tìm trong cột recordedAt
        result = result.filter((row) =>
          row.recordedAt.toLowerCase().includes(keyword)
        );
      } else if (
        sensorFilter === "Nhiệt độ" ||
        sensorFilter === "Độ ẩm" ||
        sensorFilter === "Ánh sáng"
      ) {
        // Tiêu chí Cảm biến cụ thể: tìm đúng loại cảm biến đó VÀ khớp giá trị (hoặc đơn vị) nhập vào
        result = result.filter((row) => {
          const isMatchSensor = row.sensorType === sensorFilter;
          const valueWithUnit = `${row.value} ${row.unit}`.toLowerCase();
          const valueStr = String(row.value).toLowerCase();

          return (
            isMatchSensor &&
            (valueStr.includes(keyword) || valueWithUnit.includes(keyword))
          );
        });
      } else {
        // Tiêu chí "all" (Tất cả): tìm trên mọi cột
        result = result.filter((row) => {
          const id = String(row.id).toLowerCase();
          const recordedAt = row.recordedAt.toLowerCase();
          const sensorType = row.sensorType.toLowerCase();
          const value = String(row.value).toLowerCase();
          const unit = row.unit.toLowerCase();

          return (
            id.includes(keyword) ||
            recordedAt.includes(keyword) ||
            sensorType.includes(keyword) ||
            value.includes(keyword) ||
            unit.includes(keyword)
          );
        });
      }
    }

    return result;
  }, [sensorRows, search, sensorFilter]);

  // =========================
  // RESET TRANG KHI ĐỔI TỪ KHÓA / TIÊU CHÍ
  // =========================

  useEffect(() => {
    setPage(1);
  }, [search, sensorFilter, rowsPerPage]);

  // =========================
  // PHÂN TRANG
  // =========================

  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [rows, page, rowsPerPage]);

  // =========================
  // THỐNG KÊ
  // =========================

  const statistics = useMemo(() => {
    const temperatureRows = rows.filter((row) => row.sensorType === "Nhiệt độ");
    const humidityRows = rows.filter((row) => row.sensorType === "Độ ẩm");
    const lightRows = rows.filter((row) => row.sensorType === "Ánh sáng");

    const calculateAverage = (data: SensorRow[]) => {
      if (data.length === 0) return 0;
      const total = data.reduce((sum, row) => sum + row.value, 0);
      return total / data.length;
    };

    return {
      temperature: calculateAverage(temperatureRows),
      humidity: calculateAverage(humidityRows),
      light: calculateAverage(lightRows),
    };
  }, [rows]);

  // Helper tạo placeholder động theo tiêu chí tìm kiếm
  const getSearchPlaceholder = () => {
    switch (sensorFilter) {
      case "Thời gian":
        return "Nhập thời gian (VD: 29/03/2026, 14:30...)";
      case "Nhiệt độ":
        return "Nhập giá trị nhiệt độ cần tìm (VD: 28, 30.5...)";
      case "Độ ẩm":
        return "Nhập giá trị độ ẩm cần tìm (VD: 65, 70...)";
      case "Ánh sáng":
        return "Nhập giá trị ánh sáng cần tìm (VD: 500, 1200...)";
      default:
        return "ID, loại cảm biến, giá trị, thời gian...";
    }
  };

  // =========================
  // RENDER
  // =========================

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <Box sx={{ flexShrink: 0 }}>
        <Typography variant="h5" fontWeight={800}>
          Dữ liệu cảm biến
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 1.5 }}>
          Tra cứu và thống kê dữ liệu cảm biến
        </Typography>
      </Box>

      {/* THANH TÌM KIẾM / CHỌN TIÊU CHÍ */}
      <Grid container spacing={2} sx={{ mb: 1.5, flexShrink: 0 }}>
        {/* Ô NHẬP TỪ KHÓA TÌM KIẾM */}
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            fullWidth
            size="small"
            label={
              sensorFilter === "all"
                ? "Tìm kiếm"
                : `Tìm kiếm theo ${sensorFilter}`
            }
            placeholder={getSearchPlaceholder()}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    {sensorFilter === "Thời gian" ? (
                      <AccessTimeRoundedIcon color="action" fontSize="small" />
                    ) : (
                      <SearchRoundedIcon color="action" fontSize="small" />
                    )}
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>

        {/* CHỌN TIÊU CHÍ TÌM KIẾM */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Tiêu chí tìm kiếm"
            value={sensorFilter}
            onChange={(e) =>
              setSensorFilter(e.target.value as SensorFilter)
            }
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="Nhiệt độ">Nhiệt độ</MenuItem>
            <MenuItem value="Độ ẩm">Độ ẩm</MenuItem>
            <MenuItem value="Ánh sáng">Ánh sáng</MenuItem>
            <MenuItem value="Thời gian">Thời gian</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* THỐNG KÊ */}
      <Grid container spacing={2} sx={{ mb: 1.5, flexShrink: 0 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            label="Nhiệt độ trung bình"
            value={`${statistics.temperature.toFixed(1)} °C`}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            label="Độ ẩm trung bình"
            value={`${statistics.humidity.toFixed(1)} %`}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            label="Ánh sáng trung bình"
            value={`${statistics.light.toFixed(0)} lux`}
          />
        </Grid>
      </Grid>

      {/* BẢNG DỮ LIỆU */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          flex: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Thời gian</strong></TableCell>
              <TableCell><strong>Loại cảm biến</strong></TableCell>
              <TableCell><strong>Giá trị</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.recordedAt}</TableCell>
                  <TableCell>{row.sensorType}</TableCell>
                  <TableCell>
                    {row.value} {row.unit}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>
                    Không tìm thấy dữ liệu
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PHÂN TRANG + THÔNG TIN */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
          mt: 1.5,
          flexShrink: 0,
        }}
      >
        {/* Thông tin bản ghi */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {rows.length > 0
              ? `Hiển thị ${Math.min((page - 1) * rowsPerPage + 1, rows.length)}–${Math.min(
                  page * rowsPerPage,
                  rows.length
                )} / ${rows.length} bản ghi`
              : "0 bản ghi"}
          </Typography>
          <TextField
            select
            size="small"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            sx={{ minWidth: 100 }}
            label="Bản ghi/trang"
          >
            {ROWS_PER_PAGE_OPTIONS.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Phân trang */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Trang {page} / {totalPages || 1}
          </Typography>
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size="small"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

// =========================
// STAT CARD
// =========================

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Typography color="text.secondary" variant="body2" sx={{ mb: 0.3 }}>
          {label}
        </Typography>
        <Typography variant="h6" fontWeight={800}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}