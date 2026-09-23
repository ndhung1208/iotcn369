import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { Box, Typography } from "@mui/material";

interface ChartCardProps {
  title: string;
  data: Array<{ [key: string]: any }>;
}

export default function ChartCard({ title, data }: ChartCardProps) {
  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: 3,
        p: 2.5,
        boxShadow: "0 6px 24px rgba(15,23,42,.06)",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={800}
        sx={{ mb: 2 }}
      >
        {title}
      </Typography>

      <Box sx={{ width: "100%", height: 420 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 130,
              left: 50,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
            />

            {/* =========================
                TRỤC Y - NHIỆT ĐỘ
               ========================= */}
            <YAxis
              yAxisId="temperature"
              orientation="left"
              domain={[0, 40]}
              width={50}
              tick={{ fontSize: 12 }}
              label={{
                value: "°C",
                angle: -90,
                position: "insideLeft",
              }}
            />

            {/* =========================
                TRỤC Y - ĐỘ ẨM
               ========================= */}
            <YAxis
              yAxisId="humidity"
              orientation="right"
              domain={[0, 100]}
              width={50}
              tick={{ fontSize: 12 }}
              label={{
                value: "%",
                angle: 90,
                position: "insideRight",
              }}
            />

            {/* =========================
                TRỤC Y - ÁNH SÁNG
               ========================= */}
            <YAxis
              yAxisId="light"
              orientation="right"
              domain={[0, 600]}
              width={60}
              tick={{ fontSize: 12 }}
              label={{
                value: "lux",
                angle: 90,
                position: "insideRight",
              }}
            />

            <Tooltip />

            <Legend />

            {/* =========================
                LINE NHIỆT ĐỘ
               ========================= */}
            <Line
              yAxisId="temperature"
              type="monotone"
              dataKey="temperature"
              name="Nhiệt độ (°C)"
              stroke="#f44336"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />

            {/* =========================
                LINE ĐỘ ẨM
               ========================= */}
            <Line
              yAxisId="humidity"
              type="monotone"
              dataKey="humidity"
              name="Độ ẩm (%)"
              stroke="#2196f3"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />

            {/* =========================
                LINE ÁNH SÁNG
               ========================= */}
            <Line
              yAxisId="light"
              type="monotone"
              dataKey="light"
              name="Ánh sáng (lux)"
              stroke="#ff9800"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}