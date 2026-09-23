export type SensorRecord = {
  id: number;
  temperature: number;
  humidity: number;
  light: number;
  recordedAt: string;
};

export type DeviceRecord = {
  id: number;
  device: string;
  action: "ON" | "OFF";
  activity: "SUCCESS" | "FAIL";
  changedAt: string;
};

export const sensorRecords: SensorRecord[] = Array.from(
  { length: 60 },
  (_, i) => {
    const minutesAgo = 59 - i;
    const date = new Date(Date.now() - minutesAgo * 60_000);

    return {
      id: i + 1,

      temperature: Number(
        (
          27.2 +
          Math.sin(i / 4) * 1.2 +
          (i % 5) * 0.08
        ).toFixed(1)
      ),

      humidity: Number(
        (
          63 +
          Math.cos(i / 5) * 4 +
          (i % 4) * 0.5
        ).toFixed(1)
      ),

      light: Number(
        (
          180 +
          Math.abs(Math.sin(i / 6)) * 260 +
          (i % 7) * 6
        ).toFixed(1)
      ),

      recordedAt: date.toLocaleString("vi-VN"),
    };
  }
);

export const deviceHistory: DeviceRecord[] = Array.from(
  { length: 28 },
  (_, i) => {
    const date = new Date(
      Date.now() - i * 47 * 60_000
    );

    return {
      id: i + 1,

      device: "Đèn phòng",

      action: i % 2 === 0 ? "ON" : "OFF",

      // Một số hoạt động thất bại để mô phỏng thực tế
      activity: i % 7 === 0 ? "FAIL" : "SUCCESS",

      changedAt: date.toLocaleString("vi-VN"),
    };
  }
);

