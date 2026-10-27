import { describe, it, expect } from "vitest";
import { classify, type Device } from "./fleet";
import { getDevice } from "@/data/frota";

const base: Device = {
  id: "X", model: "m", chipset: "c", tier: "mid", batteryLevel: 50, batteryCapacityMah: 5000,
  energyMah: 200, normalizedFrom: "mAh", screenOnMinutes: 60, droppedFramesPct: 0, crashes7d: 0,
  apiLevel: 34, lastContact: "2026-10-20T00:00:00Z",
};

describe("classify", () => {
  it("drain 12 %/h is critical", () => expect(classify({ ...base, energyMah: 600 }).status).toBe("CRITICO"));
  it("drain 7 %/h is attention", () => expect(classify({ ...base, energyMah: 350 }).status).toBe("ATENCAO"));
  it("3 crashes is critical", () => expect(classify({ ...base, crashes7d: 3 }).status).toBe("CRITICO"));
  it("1 crash is attention", () => expect(classify({ ...base, crashes7d: 1 }).status).toBe("ATENCAO"));
  it("15% frames is critical", () => expect(classify({ ...base, droppedFramesPct: 15 }).status).toBe("CRITICO"));
  it("8% frames is attention", () => expect(classify({ ...base, droppedFramesPct: 8 }).status).toBe("ATENCAO"));
  it("zero capacity is indeterminate", () => expect(classify({ ...base, batteryCapacityMah: 0 }).status).toBe("INDETERMINADO"));
  it("zero screen time is indeterminate", () => expect(classify({ ...base, screenOnMinutes: 0 }).status).toBe("INDETERMINADO"));
  it("healthy device is OK", () => expect(classify(base).status).toBe("OK"));
  it("mWh is converted with nominal voltage (3773 / 3.85 = 980)", () =>
    expect(getDevice("DEV-0204")!.energyMah).toBeCloseTo(980, 0));
  it("DEV-0522 has 13.4 %/h drain", () =>
    expect(classify(getDevice("DEV-0522")!).relativeDrain).toBeCloseTo(13.4, 1));
});
