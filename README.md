# IoT Dashboard React

Frontend demo cho project IoT ESP32-C3 Mini.

## Chức năng
- Dashboard: 3 thẻ chỉ số + 3 biểu đồ 20 giá trị gần nhất.
- Dữ liệu cảm biến: tìm kiếm, lọc số bản ghi, thống kê trung bình.
- Lịch sử thiết bị: tìm kiếm, lọc ON/OFF, thống kê.
- Thông tin cá nhân.
- Hiện tại dùng mock data, chưa kết nối Spring Boot/MySQL.

## Chạy project

```bash
npm install
npm run dev
```

Mở URL Vite hiển thị trong terminal, thường là `http://localhost:5173`.

Build production:

```bash
npm run build
```

## Kết nối backend sau này

Có thể thay `src/data/mockData.ts` bằng API Spring Boot, ví dụ:
- GET /api/sensors/latest
- GET /api/sensors/data
- GET /api/devices/history
- GET /api/users/profile
