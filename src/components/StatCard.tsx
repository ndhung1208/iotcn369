import { Box, Card, CardContent, Typography } from "@mui/material";
import type { ReactNode } from "react";

type Props = {
  title: string;
  value: string;
  unit?: string;
  icon: ReactNode;
  description?: string;
};

export default function StatCard({ title, value, unit, icon, description }: Props) {
  return (
    <Card sx={{ height: "100%", boxShadow: "0 6px 24px rgba(15,23,42,.06)" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>{title}</Typography>
            <Typography sx={{ fontSize: 30, fontWeight: 800, mt: .8 }}>
              {value} <Typography component="span" sx={{ fontSize: 15, fontWeight: 600 }}>{unit}</Typography>
            </Typography>
            {description && <Typography variant="caption" color="text.secondary">{description}</Typography>}
          </Box>
          <Box sx={{ width: 46, height: 46, borderRadius: 3, display: "grid", placeItems: "center", bgcolor: "#eff6ff", color: "primary.main" }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}