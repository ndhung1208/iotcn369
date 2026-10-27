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
        borderRadius: 2.5,
        p: 2,
        boxShadow: "0 1px 4px rgba(0,0,0,.06)",
        border: "1px solid #f0f0f0",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        fontSize={14}
        fontWeight={600}
        color="text.primary"
        sx={{ mb: 1 }}
      >
        {title}
      </Typography>

      <Box sx={{ flex: 1, minHeight: 0, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 110, left: 30, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
            />

            <YAxis
              yAxisId="temperature"
              orientation="left"
              domain={[0, 40]}
              width={35}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              label={{
                value: "°C",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11 },
              }}
            />

            <YAxis
              yAxisId="humidity"
              orientation="right"
              domain={[0, 100]}
              width={35}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              label={{
                value: "%",
                angle: 90,
                position: "insideRight",
                style: { fontSize: 11 },
              }}
            />

            <YAxis
              yAxisId="light"
              orientation="right"
              domain={[0, 600]}
              width={45}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              label={{
                value: "lux",
                angle: 90,
                position: "insideRight",
                style: { fontSize: 11 },
              }}
            />

            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 8px rgba(0,0,0,.08)",
              }}
            />

            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 4 }}
            />

            <Line
              yAxisId="temperature"
              type="monotone"
              dataKey="temperature"
              name="Nhiệt độ (°C)"
              stroke="#ef4444"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3 }}
            />

            <Line
              yAxisId="humidity"
              type="monotone"
              dataKey="humidity"
              name="Độ ẩm (%)"
              stroke="#3b82f6"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3 }}
            />

            <Line
              yAxisId="light"
              type="monotone"
              dataKey="light"
              name="Ánh sáng (lux)"
              stroke="#f59e0b"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}