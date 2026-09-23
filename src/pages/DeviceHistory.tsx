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

const ROWS_PER_PAGE = 15;

// =========================
// HELPER
// =========================

const parseDate = (dateString: string): Date => {
  return new Date(dateString.replace(" ", "T"));
};

// =========================
// DEVICE HISTORY
// =========================

export default function DeviceHistory() {
  // =========================
  // FILTER STATE
  // =========================

  const [search, setSearch] = useState("");
  const [device, setDevice] = useState("all");
  const [status, setStatus] = useState("all");
  const [activity, setActivity] = useState("all");

  const [page, setPage] = useState(1);

  // =========================
  // DANH SÁCH THIẾT BỊ
  // =========================

  const devices = useMemo(() => {
    return Array.from(
      new Set(deviceHistory.map((item) => item.device))
    ).sort();
  }, []);

  // =========================
  // DANH SÁCH HOẠT ĐỘNG
  // =========================

  const activities = useMemo(() => {
    return Array.from(
      new Set(deviceHistory.map((item) => item.activity))
    ).sort();
  }, []);

  // =========================
  // LỌC DỮ LIỆU
  // =========================

  const rows = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    let result = [...deviceHistory];

    // -------------------------
    // Sắp xếp thời gian
    // Mới nhất lên đầu
    // -------------------------

    result.sort(
      (a, b) =>
        parseDate(b.changedAt).getTime() -
        parseDate(a.changedAt).getTime()
    );

    // -------------------------
    // TÌM KIẾM
    // -------------------------

    if (keyword) {
      result = result.filter((row) => {
        const id = String(row.id).toLowerCase();

        const deviceName =
          row.device.toLowerCase();

        const changedAt =
          row.changedAt.toLowerCase();

        const action =
          row.action.toLowerCase();

        const rowActivity =
          row.activity.toLowerCase();

        return (
          id.includes(keyword) ||
          deviceName.includes(keyword) ||
          changedAt.includes(keyword) ||
          action.includes(keyword) ||
          rowActivity.includes(keyword)
        );
      });
    }

    // -------------------------
    // LỌC THEO THIẾT BỊ
    // -------------------------

    if (device !== "all") {
      result = result.filter(
        (row) => row.device === device
      );
    }

    // -------------------------
    // LỌC THEO TRẠNG THÁI
    // -------------------------

    if (status !== "all") {
      result = result.filter(
        (row) => row.action === status
      );
    }

    // -------------------------
    // LỌC THEO HOẠT ĐỘNG
    // -------------------------

    if (activity !== "all") {
      result = result.filter(
        (row) => row.activity === activity
      );
    }

    return result;
  }, [
    search,
    device,
    status,
    activity,
  ]);

  // =========================
  // RESET TRANG KHI FILTER
  // =========================

  useEffect(() => {
    setPage(1);
  }, [
    search,
    device,
    status,
    activity,
  ]);

  // =========================
  // RESET FILTER
  // =========================

  const handleReset = () => {
    setSearch("");
    setDevice("all");
    setStatus("all");
    setActivity("all");
    setPage(1);
  };

  // =========================
  // PHÂN TRANG
  // =========================

  const totalPages = Math.ceil(
    rows.length / ROWS_PER_PAGE
  );

  const paginatedRows = useMemo(() => {
    const start =
      (page - 1) * ROWS_PER_PAGE;

    return rows.slice(
      start,
      start + ROWS_PER_PAGE
    );
  }, [rows, page]);

  // =========================
  // THỐNG KÊ
  // =========================

  const statistics = useMemo(() => {
    return rows.reduce(
      (result, row) => {
        result.total += 1;

        if (row.action === "ON") {
          result.on += 1;
        }

        if (row.action === "OFF") {
          result.off += 1;
        }

        if (row.activity === "SUCCESS") {
          result.success += 1;
        }

        if (row.activity !== "SUCCESS") {
          result.failed += 1;
        }

        return result;
      },
      {
        total: 0,
        on: 0,
        off: 0,
        success: 0,
        failed: 0,
      }
    );
  }, [rows]);

  // =========================
  // RENDER
  // =========================

  return (
    <Box>
      {/* =========================
          HEADER
         ========================= */}

      <Typography
        variant="h5"
        fontWeight={800}
      >
        Lịch sử thiết bị
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Theo dõi lịch sử bật/tắt của thiết bị
      </Typography>

      {/* =========================
          THANH BỘ LỌC
         ========================= */}

      <Card
        sx={{
          mb: 2,
          borderRadius: 3,
        }}
      >
        <CardContent
          sx={{
            "&:last-child": {
              pb: 2,
            },
          }}
        >
          <Grid
            container
            spacing={2}
            alignItems="center"
          >
            {/* =====================
                TÌM KIẾM
               ===================== */}

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <TextField
                fullWidth
                label="Tìm kiếm"
                placeholder="ID, thiết bị, thời gian..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon
                          color="action"
                          fontSize="small"
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            {/* =====================
                THIẾT BỊ
               ===================== */}

            <Grid
              size={{
                xs: 12,
                sm: 4,
                md: 2,
              }}
            >
              <TextField
                select
                fullWidth
                label="Thiết bị"
                value={device}
                onChange={(e) =>
                  setDevice(e.target.value)
                }
                size="small"
              >
                <MenuItem value="all">
                  Tất cả
                </MenuItem>

                {devices.map((item) => (
                  <MenuItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* =====================
                TRẠNG THÁI
               ===================== */}

            <Grid
              size={{
                xs: 12,
                sm: 4,
                md: 2,
              }}
            >
              <TextField
                select
                fullWidth
                label="Trạng thái"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                size="small"
              >
                <MenuItem value="all">
                  Tất cả
                </MenuItem>

                <MenuItem value="ON">
                  Bật (ON)
                </MenuItem>

                <MenuItem value="OFF">
                  Tắt (OFF)
                </MenuItem>
              </TextField>
            </Grid>

            {/* =====================
                HOẠT ĐỘNG
               ===================== */}

            <Grid
              size={{
                xs: 12,
                sm: 4,
                md: 2,
              }}
            >
              <TextField
                select
                fullWidth
                label="Hoạt động"
                value={activity}
                onChange={(e) =>
                  setActivity(e.target.value)
                }
                size="small"
              >
                <MenuItem value="all">
                  Tất cả
                </MenuItem>

                {activities.map((item) => (
                  <MenuItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* =====================
                ĐẶT LẠI
               ===================== */}

            <Grid
              size={{
                xs: 12,
                sm: 12,
                md: 2,
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                startIcon={
                  <RestartAltRoundedIcon />
                }
                onClick={handleReset}
                size="small"
                sx={{
                  height: 40,
                  borderRadius: 2,
                  whiteSpace: "nowrap",
                }}
              >
                Đặt lại
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* =========================
          THỐNG KÊ
         ========================= */}

      <Grid
        container
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <StatCard
            label="Tổng hoạt động"
            value={statistics.total}
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <StatCard
            label="Số lần bật"
            value={statistics.on}
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <StatCard
            label="Số lần tắt"
            value={statistics.off}
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <StatCard
            label="Hoạt động thành công"
            value={statistics.success}
          />
        </Grid>
      </Grid>

      {/* =========================
          BẢNG LỊCH SỬ
         ========================= */}

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          mb: 2,
          overflow: "hidden",
        }}
      >
        <Table>
          {/* HEADER */}

          <TableHead>
            <TableRow>
              <TableCell>
                <strong>ID</strong>
              </TableCell>

              <TableCell>
                <strong>Thiết bị</strong>
              </TableCell>

              <TableCell>
                <strong>Trạng thái</strong>
              </TableCell>

              <TableCell>
                <strong>Hoạt động</strong>
              </TableCell>

              <TableCell>
                <strong>Thời gian</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          {/* BODY */}

          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                >
                  {/* ID */}

                  <TableCell>
                    {row.id}
                  </TableCell>

                  {/* THIẾT BỊ */}

                  <TableCell>
                    {row.device}
                  </TableCell>

                  {/* TRẠNG THÁI */}

                  <TableCell>
                    <Chip
                      label={row.action}
                      size="small"
                      color={
                        row.action === "ON"
                          ? "success"
                          : "default"
                      }
                    />
                  </TableCell>

                  {/* HOẠT ĐỘNG */}

                  <TableCell>
                    <Chip
                      label={row.activity}
                      size="small"
                      color={
                        row.activity ===
                        "SUCCESS"
                          ? "success"
                          : "error"
                      }
                      variant="outlined"
                    />
                  </TableCell>

                  {/* THỜI GIAN */}

                  <TableCell>
                    {row.changedAt}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                >
                  <Typography
                    color="text.secondary"
                    sx={{ py: 3 }}
                  >
                    Không tìm thấy dữ liệu
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* =========================
          PHÂN TRANG
         ========================= */}

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) =>
            setPage(value)
          }
          color="primary"
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        />
      )}
    </Box>
  );
}

// =========================
// STAT CARD
// =========================

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        height: "100%",
      }}
    >
      <CardContent>
        <Typography
          color="text.secondary"
          sx={{ mb: 0.5 }}
        >
          {label}
        </Typography>

        <Typography
          variant="h5"
          fontWeight={800}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

