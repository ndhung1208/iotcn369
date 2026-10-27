import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Link,
  Typography,
} from "@mui/material";

import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import WcRoundedIcon from "@mui/icons-material/WcRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import ApiRoundedIcon from "@mui/icons-material/ApiRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import avt from "./avt.jpg";
export default function Profile() {
  const student = {
    name: "Nguyễn Duy Hưng",
    code: "B23DCCN369",
    gender: "Nam",
    birthDate: "12/08/2005",

    email: "nguyenduyhung101010@gmail.com",
    github: "https://github.com/ndhung1208/iotcn369",

    // Thay bằng link Postman của bạn
    postman: "https://hungiot.getpostman.com/view/your-postman-link",

    // Thay bằng link PDF của bạn
    pdf: "https://hungnd.com/document.pdf",

    avatar: avt,
  };

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <Box sx={{ mb: 2, flexShrink: 0 }}>
        <Typography variant="h5" fontWeight={800}>
          Thông tin cá nhân
        </Typography>

        <Typography color="text.secondary">
          Thông tin sinh viên
        </Typography>
      </Box>

      {/* Profile Card */}
      <Card
        sx={{
          width: "100%",
          borderRadius: 4,
          boxShadow: "0 8px 30px rgba(15,23,42,.07)",
          overflow: "auto",
          flex: 1,
          minHeight: 0,
        }}
      >
        <CardContent
          sx={{
            p: { xs: 3, md: 5 },
          }}
        >
          <Grid container spacing={{ xs: 4, md: 6 }}>
            {/* AVATAR */}
            <Grid
              size={{ xs: 12, md: 4 }}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={student.avatar || undefined}
                    alt={student.name}
                    sx={{
                      width: { xs: 160, md: 200 },
                      height: { xs: 160, md: 200 },
                      bgcolor: "primary.main",
                      fontSize: { xs: 55, md: 70 },
                      fontWeight: 700,
                      boxShadow: "0 10px 35px rgba(0,0,0,.12)",
                    }}
                  >
                    {!student.avatar && "H"}
                  </Avatar>

                  {/* Chọn ảnh */}
                  <IconButton
                    component="label"
                    sx={{
                      position: "absolute",
                      right: 8,
                      bottom: 8,
                      width: 48,
                      height: 48,
                      bgcolor: "primary.main",
                      color: "white",
                      border: "4px solid white",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    }}
                  >
                    <PhotoCameraRoundedIcon />

                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (file) {
                          console.log("Ảnh đã chọn:", file);
                        }
                      }}
                    />
                  </IconButton>
                </Box>

                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{
                    mt: 3,
                    textAlign: "center",
                  }}
                >
                  {student.name}
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Sinh viên • Hệ thống IoT
                </Typography>

                <Typography
                  color="text.secondary"
                  variant="body2"
                  sx={{ mt: 1 }}
                >
                  {student.code}
                </Typography>
              </Box>
            </Grid>

            {/* INFORMATION */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ mb: 2 }}
              >
                Thông tin sinh viên
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Info
                    icon={<BadgeRoundedIcon />}
                    label="Mã sinh viên"
                    value={student.code}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Info
                    icon={<WcRoundedIcon />}
                    label="Giới tính"
                    value={student.gender}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Info
                    icon={<CalendarMonthRoundedIcon />}
                    label="Ngày sinh"
                    value={student.birthDate}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Info
                    icon={<SchoolRoundedIcon />}
                    label="Vai trò"
                    value="Sinh viên"
                  />
                </Grid>
              </Grid>

              {/* CONTACT */}
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ mt: 4, mb: 2 }}
              >
                Liên hệ
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                {/* Gmail */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Contact
                    icon={<EmailRoundedIcon />}
                    label="Gmail"
                  >
                    <Link
                      href={`mailto:${student.email}`}
                      underline="hover"
                      color="inherit"
                      fontWeight={700}
                    >
                      {student.email}
                    </Link>
                  </Contact>
                </Grid>

                {/* GitHub */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Contact
                    icon={<GitHubIcon />}
                    label="GitHub"
                  >
                    <Link
                      href={student.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      color="inherit"
                      fontWeight={700}
                    >
                      GitHub Profile
                    </Link>
                  </Contact>
                </Grid>

                {/* Postman */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Contact
                    icon={<ApiRoundedIcon />}
                    label="Postman API"
                  >
                    <Link
                      href={student.postman}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      color="inherit"
                      fontWeight={700}
                    >
                      Xem API trên Postman
                    </Link>
                  </Contact>
                </Grid>

                {/* PDF */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Contact
                    icon={<PictureAsPdfRoundedIcon />}
                    label="Tài liệu PDF"
                  >
                    <Link
                      href={student.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      color="inherit"
                      fontWeight={700}
                    >
                      Xem tài liệu PDF
                    </Link>
                  </Contact>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 2.2,
        bgcolor: "#f8fafc",
        borderRadius: 3,
        minHeight: 72,
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "primary.main",
          bgcolor: "rgba(25,118,210,.08)",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
        >
          {label}
        </Typography>

        <Typography fontWeight={700}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

function Contact({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 2.2,
        bgcolor: "#f8fafc",
        borderRadius: 3,
        minHeight: 72,
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "primary.main",
          bgcolor: "rgba(25,118,210,.08)",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
        >
          {label}
        </Typography>

        <Typography
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {children}
        </Typography>
      </Box>
    </Box>
  );
}

