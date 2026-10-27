import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

import { deviceHistory } from "../data/mockData";

const ROWS_PER_PAGE_OPTIONS = [10, 15, 25, 50];

const parseDate = (dateString: string): Date => {
  return new Date(dateString.replace(" ", "T"));
};

// Hàm hỗ trợ lấy đúng giá trị Hoạt động (ON / OFF) dù mockData dùng key 'action' hay 'activity'
const getRowActivity = (row: any): string => {
  const act = String(row.action || "").toUpperCase();
  if (act === "ON" || act === "OFF") return act;
  const actv = String(row.activity || "").toUpperCase();
  if (actv === "ON" || actv === "OFF") return actv;
  return act || actv;
};

// Hàm hỗ trợ lấy đúng giá trị Trạng thái (SUCCESS / FAIL / PENDING) dù mockData dùng key 'status' hay 'activity'
const getRowStatus = (row: any): string => {
  if (row.status) return String(row.status).toUpperCase();
  const actv = String(row.activity || "").toUpperCase();
  if (["SUCCESS", "FAIL", "FAILED", "PENDING"].includes(actv)) {
    return actv === "FAILED" ? "FAIL" : actv;
  }
  const act = String(row.action || "").toUpperCase();
  if (["SUCCESS", "FAIL", "FAILED", "PENDING"].includes(act)) {
    return act === "FAILED" ? "FAIL" : act;
  }
  return actv;
};

export default function DeviceHistory() {
  const [timeSearch, setTimeSearch] = useState("");
  const [device, setDevice] = useState("all");
  const [activity, setActivity] = useState("all"); // ON, OFF
  const [status, setStatus] = useState("all"); // SUCCESS, FAIL, PENDING
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const devices = useMemo(() => {
    return Array.from(new Set(deviceHistory.map((item) => item.device))).sort();
  }, []);

  const rows = useMemo(() => {
    let result = [...deviceHistory];

    // Sắp xếp mới nhất lên đầu
    result.sort(
      (a, b) =>
        parseDate(b.changedAt).getTime() - parseDate(a.changedAt).getTime()
    );

    // TÌM KIẾM THEO THỜI GIAN
    const timeKeyword = timeSearch.trim().toLowerCase();
    if (timeKeyword) {
      result = result.filter((row) =>
        row.changedAt.toLowerCase().includes(timeKeyword)
      );
    }

    // LỌC THEO THIẾT BỊ
    if (device !== "all") {
      result = result.filter((row) => row.device === device);
    }

    // LỌC THEO HOẠT ĐỘNG (ON, OFF)
    if (activity !== "all") {
      result = result.filter((row) => getRowActivity(row) === activity);
    }

    // LỌC THEO TRẠNG THÁI (SUCCESS, FAIL, PENDING)
    if (status !== "all") {
      result = result.filter((row) => getRowStatus(row) === status);
    }

    return result;
  }, [timeSearch, device, activity, status]);

  // Reset trang khi đổi filter
  useEffect(() => {
    setPage(1);
  }, [timeSearch, device, activity, status, rowsPerPage]);

  const handleReset = () => {
    setTimeSearch("");
    setDevice("all");
    setActivity("all");
    setStatus("all");
    setPage(1);
  };

  // Phân trang
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [rows, page, rowsPerPage]);

  // Thống kê
  const statistics = useMemo(() => {
    return rows.reduce(
      (result, row) => {
        const act = getRowActivity(row);
        const stat = getRowStatus(row);

        result.total += 1;
        if (act === "ON") result.on += 1;
        if (act === "OFF") result.off += 1;
        if (stat === "SUCCESS") result.success += 1;
        if (stat === "FAIL") result.fail += 1;
        if (stat === "PENDING") result.pending += 1;
        return result;
      },
      { total: 0, on: 0, off: 0, success: 0, fail: 0, pending: 0 }
    );
  }, [rows]);

  // Màu sắc cho Chip Trạng thái (SUCCESS, FAIL, PENDING)
  const getStatusChipColor = (stat: string) => {
    switch (stat) {
      case "SUCCESS":
        return "success";
      case "PENDING":
        return "warning";
      case "FAIL":
      default:
        return "error";
    }
  };

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
          Lịch sử thiết bị
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Theo dõi lịch sử hoạt động (ON/OFF) và trạng thái thiết bị
        </Typography>
      </Box>

      {/* THANH BỘ LỌC */}
      <Card sx={{ mb: 2, borderRadius: 3, flexShrink: 0 }}>
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          <Grid container spacing={2} alignItems="center">
            {/* TÌM KIẾM THEO THỜI GIAN */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Tìm theo thời gian"
                placeholder="VD: 13/10/2026, 21:00..."
                value={timeSearch}
                onChange={(e) => setTimeSearch(e.target.value)}
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            {/* THIẾT BỊ */}
            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
              <TextField
                select
                fullWidth
                label="Thiết bị"
                value={device}
                onChange={(e) => setDevice(e.target.value)}
                size="small"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                {devices.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* HOẠT ĐỘNG: Chỉ gồm ON, OFF */}
            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
              <TextField
                select
                fullWidth
                label="Hoạt động"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                size="small"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="ON">Bật (ON)</MenuItem>
                <MenuItem value="OFF">Tắt (OFF)</MenuItem>
              </TextField>
            </Grid>

            {/* TRẠNG THÁI: Gồm SUCCESS, FAIL, PENDING */}
            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
              <TextField
                select
                fullWidth
                label="Trạng thái"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                size="small"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="SUCCESS">Thành công (SUCCESS)</MenuItem>
                <MenuItem value="FAIL">Thất bại (FAIL)</MenuItem>
                <MenuItem value="PENDING">Đang chờ (PENDING)</MenuItem>
              </TextField>
            </Grid>

            {/* ĐẶT LẠI */}
            <Grid size={{ xs: 12, sm: 12, md: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RestartAltRoundedIcon />}
                onClick={handleReset}
                size="small"
                sx={{ height: 40, borderRadius: 2, whiteSpace: "nowrap" }}
              >
                Đặt lại
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* THỐNG KÊ */}
      <Grid container spacing={2} sx={{ mb: 2, flexShrink: 0 }}>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard label="Tổng bản ghi" value={statistics.total} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard label="Bật (ON)" value={statistics.on} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard label="Tắt (OFF)" value={statistics.off} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard label="Thành công (SUCCESS)" value={statistics.success} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard label="Thất bại (FAIL)" value={statistics.fail} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard label="Đang chờ (PENDING)" value={statistics.pending} />
        </Grid>
      </Grid>

      {/* BẢNG LỊCH SỬ */}
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
              <TableCell><strong>Thiết bị</strong></TableCell>
              <TableCell><strong>Hoạt động</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
              <TableCell><strong>Thời gian</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row) => {
                const act = getRowActivity(row);
                const stat = getRowStatus(row);

                return (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.device}</TableCell>
                    {/* CỘT HOẠT ĐỘNG: ON / OFF */}
                    <TableCell>
                      <Chip
                        label={act}
                        size="small"
                        color={act === "ON" ? "success" : "default"}
                      />
                    </TableCell>
                    {/* CỘT TRẠNG THÁI: SUCCESS / FAIL / PENDING */}
                    <TableCell>
                      <Chip
                        label={stat}
                        size="small"
                        color={getStatusChipColor(stat)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{row.changedAt}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
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
              ? `Hiển thị ${Math.min((page - 1) * rowsPerPage + 1, rows.length)}–${Math.min(page * rowsPerPage, rows.length)} / ${rows.length} bản ghi`
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

function StatCard({ label, value }: { label: string; value: number }) {
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