// Pure domain: no UI, no data-source knowledge. Receives energy already in mAh.
export type DeviceStatus = "OK" | "ATENCAO" | "CRITICO" | "INDETERMINADO";

export interface Device {
  id: string;
  model: string;
  chipset: string;
  tier: string;
  batteryLevel: number;
  batteryCapacityMah: number | null;
  energyMah: number | null; // null when it could not be normalized
  normalizedFrom: "mAh" | "mWh";
  screenOnMinutes: number;
  droppedFramesPct: number;
  crashes7d: number;
  apiLevel: number;
  lastContact: string;
}

export const THRESHOLDS = {
  critical: { drain: 12, crashes: 3, frames: 15 },
  attention: { drain: 7, crashes: 1, frames: 8 },
} as const;

export type Reason =
  | { kind: "noCapacity" }
  | { kind: "noScreen" }
  | { kind: "noVoltage" }
  | { kind: "drain"; value: number; limit: number }
  | { kind: "crashes"; value: number; limit: number }
  | { kind: "frames"; value: number; limit: number }
  | { kind: "none" };

export interface Classification {
  status: DeviceStatus;
  reason: Reason;
  absoluteDrain: number | null; // mAh/h
  relativeDrain: number | null; // %/h
}

export function classify(d: Device): Classification {
  const empty = { absoluteDrain: null, relativeDrain: null };
  if (d.batteryCapacityMah == null || d.batteryCapacityMah <= 0)
    return { status: "INDETERMINADO", reason: { kind: "noCapacity" }, ...empty };
  if (!(d.screenOnMinutes > 0))
    return { status: "INDETERMINADO", reason: { kind: "noScreen" }, ...empty };
  if (d.energyMah == null)
    return { status: "INDETERMINADO", reason: { kind: "noVoltage" }, ...empty };

  const absoluteDrain = d.energyMah / (d.screenOnMinutes / 60);
  const relativeDrain = (absoluteDrain / d.batteryCapacityMah) * 100;
  const base = { absoluteDrain, relativeDrain };

  const check = (t: { drain: number; crashes: number; frames: number }): Reason | null => {
    if (relativeDrain >= t.drain) return { kind: "drain", value: relativeDrain, limit: t.drain };
    if (d.crashes7d >= t.crashes) return { kind: "crashes", value: d.crashes7d, limit: t.crashes };
    if (d.droppedFramesPct >= t.frames)
      return { kind: "frames", value: d.droppedFramesPct, limit: t.frames };
    return null;
  };

  const crit = check(THRESHOLDS.critical);
  if (crit) return { status: "CRITICO", reason: crit, ...base };
  const att = check(THRESHOLDS.attention);
  if (att) return { status: "ATENCAO", reason: att, ...base };
  return { status: "OK", reason: { kind: "none" }, ...base };
}
