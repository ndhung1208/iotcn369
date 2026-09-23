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

import { sensorRecords } from "../data/mockData";

const ROWS_PER_PAGE = 15;

const parseDate = (dateString: string) =>
  new Date(dateString.replace(" ", "T"));

type SensorType =
  | "Nhiệt độ"
  | "Độ ẩm"
  | "Ánh sáng";

type SensorFilter = "all" | SensorType;

type SensorRow = {
  id: number;
  recordedAt: string;
  sensorType: SensorType;
  value: number;
  unit: string;
};

export default function SensorData() {
  const [search, setSearch] = useState("");
  const [sensorFilter, setSensorFilter] =
    useState<SensorFilter>("all");

  const [page, setPage] = useState(1);

  // =========================
  // CHUYỂN DỮ LIỆU
  // =========================
  //
  // Mỗi giá trị cảm biến = 1 record
  //
  // ID hiển thị:
  // 1
  // 2
  // 3
  // 4
  // ...
  //
  // Không còn:
  // 1-T
  // 1-H
  // 1-L
  //
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
  // LỌC DỮ LIỆU
  // =========================

  const rows = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    let result = [...sensorRows];

    // -------------------------
    // Sắp xếp theo thời gian
    // Mới nhất lên đầu
    // -------------------------

    result.sort(
      (a, b) =>
        parseDate(b.recordedAt).getTime() -
        parseDate(a.recordedAt).getTime()
    );

    // -------------------------
    // TÌM KIẾM
    // -------------------------

    if (keyword) {
      result = result.filter((row) => {
        const id = String(row.id).toLowerCase();

        const recordedAt =
          row.recordedAt.toLowerCase();

        const sensorType =
          row.sensorType.toLowerCase();

        const value = String(row.value).toLowerCase();

        const unit =
          row.unit.toLowerCase();

        return (
          id.includes(keyword) ||
          recordedAt.includes(keyword) ||
          sensorType.includes(keyword) ||
          value.includes(keyword) ||
          unit.includes(keyword)
        );
      });
    }

    // -------------------------
    // LỌC THEO LOẠI CẢM BIẾN
    // -------------------------

    if (sensorFilter !== "all") {
      result = result.filter(
        (row) =>
          row.sensorType === sensorFilter
      );
    }

    return result;
  }, [
    sensorRows,
    search,
    sensorFilter,
  ]);

  // =========================
  // RESET TRANG KHI ĐỔI FILTER
  // =========================

  useEffect(() => {
    setPage(1);
  }, [search, sensorFilter]);

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
    const temperatureRows = rows.filter(
      (row) =>
        row.sensorType === "Nhiệt độ"
    );

    const humidityRows = rows.filter(
      (row) =>
        row.sensorType === "Độ ẩm"
    );

    const lightRows = rows.filter(
      (row) =>
        row.sensorType === "Ánh sáng"
    );

    const calculateAverage = (
      data: SensorRow[]
    ) => {
      if (data.length === 0) {
        return 0;
      }

      const total = data.reduce(
        (sum, row) =>
          sum + row.value,
        0
      );

      return total / data.length;
    };

    return {
      temperature:
        calculateAverage(
          temperatureRows
        ),

      humidity:
        calculateAverage(
          humidityRows
        ),

      light:
        calculateAverage(
          lightRows
        ),
    };
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
        Dữ liệu cảm biến
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Tra cứu và thống kê dữ liệu
        cảm biến
      </Typography>

      {/* =========================
          THANH TÌM KIẾM / LỌC
         ========================= */}

      <Grid
        container
        spacing={2}
        sx={{ mb: 2 }}
      >
        {/* TÌM KIẾM */}

        <Grid
          size={{
            xs: 12,
            md: 8,
          }}
        >
          <TextField
            fullWidth
            label="Tìm kiếm"
            placeholder="ID, thời gian, loại cảm biến..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>

        {/* LỌC CẢM BIẾN */}

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <TextField
            select
            fullWidth
            label="Lọc theo cảm biến"
            value={sensorFilter}
            onChange={(e) =>
              setSensorFilter(
                e.target.value as SensorFilter
              )
            }
          >
            <MenuItem value="all">
              Tất cả
            </MenuItem>

            <MenuItem value="Nhiệt độ">
              Nhiệt độ
            </MenuItem>

            <MenuItem value="Độ ẩm">
              Độ ẩm
            </MenuItem>

            <MenuItem value="Ánh sáng">
              Ánh sáng
            </MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* =========================
          THỐNG KÊ
         ========================= */}

      <Grid
        container
        spacing={2}
        sx={{ mb: 2 }}
      >
        {/* NHIỆT ĐỘ */}

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <StatCard
            label="Nhiệt độ trung bình"
            value={`${statistics.temperature.toFixed(
              1
            )} °C`}
          />
        </Grid>

        {/* ĐỘ ẨM */}

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <StatCard
            label="Độ ẩm trung bình"
            value={`${statistics.humidity.toFixed(
              1
            )} %`}
          />
        </Grid>

        {/* ÁNH SÁNG */}

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <StatCard
            label="Ánh sáng trung bình"
            value={`${statistics.light.toFixed(
              0
            )} lux`}
          />
        </Grid>
      </Grid>

      {/* =========================
          BẢNG DỮ LIỆU
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
                <strong>Thời gian</strong>
              </TableCell>

              <TableCell>
                <strong>
                  Loại cảm biến
                </strong>
              </TableCell>

              <TableCell>
                <strong>Giá trị</strong>
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

                  {/* THỜI GIAN */}

                  <TableCell>
                    {row.recordedAt}
                  </TableCell>

                  {/* LOẠI CẢM BIẾN */}

                  <TableCell>
                    {row.sensorType}
                  </TableCell>

                  {/* GIÁ TRỊ */}

                  <TableCell>
                    {row.value} {row.unit}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
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
            justifyContent:
              "center",
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
  value: string;
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

