import type { Device } from "@/domain/fleet";

// Raw telemetry, mirroring frota.json (contains the two documented defects).
interface DeviceDto {
  id: string;
  model: string;
  chipset: string;
  tier: string;
  batteryLevel: number;
  batteryCapacityMah?: number | null;
  energyConsumed: number;
  energyUnit: "mAh" | "mWh";
  nominalVoltage?: number | null;
  screenOnMinutes: number;
  droppedFramesPct: number;
  crashes7d: number;
  apiLevel: number;
  lastContact: string;
}

const d = (
  id: string, model: string, chipset: string, tier: string, batteryLevel: number,
  cap: number | null, energy: number, unit: "mAh" | "mWh", volt: number | null,
  screen: number, frames: number, crashes: number, api: number, last: string,
): DeviceDto => ({
  id, model, chipset, tier, batteryLevel, batteryCapacityMah: cap, energyConsumed: energy,
  energyUnit: unit, nominalVoltage: volt, screenOnMinutes: screen, droppedFramesPct: frames,
  crashes7d: crashes, apiLevel: api, lastContact: last,
});

export const FROTA: DeviceDto[] = [
  d("DEV-0137", "Pixel 6a", "Tensor G1", "mid", 38, 4410, 980, "mAh", 3.85, 210, 4.2, 1, 34, "2026-10-20T03:12:00Z"),
  d("DEV-0204", "Galaxy A54", "Exynos 1380", "mid", 61, 5000, 3773, "mWh", 3.85, 186, 3.1, 0, 34, "2026-10-20T02:40:00Z"),
  d("DEV-0522", "Redmi Note 12", "Snapdragon 685", "low", 24, 5000, 6105, "mWh", 3.85, 142, 9.8, 1, 33, "2026-10-20T02:58:00Z"),
  d("DEV-0311", "Moto G13", "Helio G85", "low", 12, 0, 612, "mAh", 3.85, 95, 6.0, 0, 33, "2026-10-19T22:05:00Z"),
  d("DEV-0418", "Pixel 8", "Tensor G3", "high", 77, 4575, 600, "mAh", 3.89, 240, 1.8, 0, 35, "2026-10-20T03:30:00Z"),
  d("DEV-0630", "Galaxy S23", "SD 8 Gen 2", "high", 55, 3900, 520, "mAh", 3.88, 180, 2.2, 0, 34, "2026-10-20T03:01:00Z"),
  d("DEV-0102", "Galaxy A14", "Exynos 850", "low", 44, 5000, 1450, "mAh", 3.85, 200, 11.2, 0, 34, "2026-10-20T01:15:00Z"),
  d("DEV-0115", "Moto G54", "Dimensity 7020", "mid", 82, 6000, 900, "mAh", 3.87, 230, 3.4, 0, 34, "2026-10-20T03:20:00Z"),
  d("DEV-0149", "Redmi 12C", "Helio G85", "low", 19, 5000, 1300, "mAh", 3.85, 0, 7.5, 2, 33, "2026-10-19T20:44:00Z"),
  d("DEV-0163", "Pixel 7", "Tensor G2", "high", 66, 4355, 2300, "mWh", 3.87, 160, 2.9, 0, 34, "2026-10-20T03:05:00Z"),
  d("DEV-0178", "Galaxy A34", "Dimensity 1080", "mid", 31, 5000, 1180, "mAh", 3.86, 170, 5.4, 3, 34, "2026-10-20T00:50:00Z"),
  d("DEV-0189", "Moto E13", "Unisoc T606", "low", 9, 5000, 1900, "mAh", 3.85, 120, 16.4, 1, 33, "2026-10-19T23:30:00Z"),
  d("DEV-0233", "Galaxy S24", "Exynos 2400", "high", 90, 4000, 450, "mAh", 3.88, 150, 1.4, 0, 35, "2026-10-20T03:40:00Z"),
  d("DEV-0247", "Redmi Note 13", "SD 685", "mid", 58, 5000, 4200, "mWh", 3.85, 205, 4.8, 0, 34, "2026-10-20T02:12:00Z"),
  d("DEV-0256", "Xiaomi 13T", "Dimensity 8200", "high", 71, 5000, 2100, "mWh", null, 175, 2.0, 0, 34, "2026-10-20T02:33:00Z"),
  d("DEV-0268", "Pixel 6", "Tensor G1", "mid", 47, 4614, 1050, "mAh", 3.85, 145, 6.1, 0, 34, "2026-10-20T01:58:00Z"),
  d("DEV-0281", "Galaxy A24", "Helio G99", "low", 36, 5000, 1100, "mAh", 3.85, 190, 8.3, 0, 34, "2026-10-20T02:20:00Z"),
  d("DEV-0295", "Moto Edge 40", "Dimensity 8020", "high", 64, 4400, 700, "mAh", 3.87, 220, 2.5, 0, 34, "2026-10-20T03:10:00Z"),
  d("DEV-0342", "Galaxy M14", "Exynos 1330", "low", 28, 6000, 2200, "mAh", 3.85, 150, 7.1, 4, 33, "2026-10-19T21:47:00Z"),
  d("DEV-0359", "Pixel 7a", "Tensor G2", "mid", 53, 4385, 3100, "mWh", 3.87, 190, 3.6, 0, 34, "2026-10-20T02:55:00Z"),
  d("DEV-0376", "Redmi 13C", "Helio G85", "low", 41, 5000, 1000, "mAh", 3.85, 165, 5.2, 0, 34, "2026-10-20T01:40:00Z"),
  d("DEV-0390", "Galaxy A15", "Helio G99", "low", 69, null, 820, "mAh", 3.85, 140, 4.4, 0, 34, "2026-10-20T00:22:00Z"),
  d("DEV-0405", "Moto G84", "SD 695", "mid", 74, 5000, 760, "mAh", 3.87, 210, 2.8, 0, 34, "2026-10-20T03:18:00Z"),
  d("DEV-0433", "Galaxy S22", "SD 8 Gen 1", "high", 22, 3700, 1250, "mAh", 3.88, 130, 6.6, 0, 34, "2026-10-20T01:05:00Z"),
  d("DEV-0447", "Poco X6", "SD 7s Gen 2", "mid", 85, 5100, 2800, "mWh", 3.87, 230, 2.1, 0, 34, "2026-10-20T03:25:00Z"),
  d("DEV-0461", "Moto G24", "Helio G85", "low", 33, 5000, 1700, "mAh", 3.85, 110, 9.0, 2, 33, "2026-10-19T23:58:00Z"),
  d("DEV-0478", "Pixel 8a", "Tensor G3", "mid", 59, 4492, 650, "mAh", 3.88, 175, 1.9, 0, 35, "2026-10-20T03:02:00Z"),
  d("DEV-0489", "Galaxy A05s", "SD 680", "low", 15, 5000, 7200, "mWh", 3.85, 160, 12.5, 2, 33, "2026-10-19T22:48:00Z"),
  d("DEV-0503", "Redmi Note 12 Pro", "Dimensity 1080", "mid", 62, 5000, 950, "mAh", 3.86, 200, 3.9, 0, 34, "2026-10-20T02:44:00Z"),
  d("DEV-0517", "Galaxy A55", "Exynos 1480", "mid", 80, 5000, 880, "mAh", 3.87, 225, 2.6, 0, 34, "2026-10-20T03:35:00Z"),
];

// Mapping DTO -> domain. Unit normalization happens here so the domain only sees mAh.
export function toDevice(dto: DeviceDto): Device {
  let energyMah: number | null = dto.energyConsumed;
  if (dto.energyUnit === "mWh") {
    energyMah = dto.nominalVoltage && dto.nominalVoltage > 0 ? dto.energyConsumed / dto.nominalVoltage : null;
  }
  return {
    id: dto.id, model: dto.model, chipset: dto.chipset, tier: dto.tier,
    batteryLevel: dto.batteryLevel, batteryCapacityMah: dto.batteryCapacityMah ?? null,
    energyMah, normalizedFrom: dto.energyUnit, screenOnMinutes: dto.screenOnMinutes,
    droppedFramesPct: dto.droppedFramesPct, crashes7d: dto.crashes7d, apiLevel: dto.apiLevel,
    lastContact: dto.lastContact,
  };
}

export const getDevices = (): Device[] => FROTA.map(toDevice);
export const getDevice = (id: string) => getDevices().find((x) => x.id === id);
