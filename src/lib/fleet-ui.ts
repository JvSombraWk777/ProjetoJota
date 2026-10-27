import { useEffect, useState } from "react";
import type { DeviceStatus, Classification, Device } from "@/domain/fleet";

export const STATUS_LABEL: Record<DeviceStatus, string> = {
  OK: "OK", ATENCAO: "Atenção", CRITICO: "Crítico", INDETERMINADO: "Sem dados",
};
export const STATUS_CLASS: Record<DeviceStatus, string> = {
  OK: "status-ok", ATENCAO: "status-warn", CRITICO: "status-crit", INDETERMINADO: "status-none",
};

export const fmt = (n: number, digits = 1) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits });

export function explain(c: Classification, d: Device): { text: string; strong: string[] } {
  const norm = d.normalizedFrom === "mWh" && c.absoluteDrain != null
    ? " Consumo normalizado a partir de mWh antes da comparação." : "";
  const r = c.reason;
  switch (r.kind) {
    case "noCapacity": return { text: "Capacidade da bateria ausente ou igual a zero — não é possível calcular o dreno relativo.", strong: [] };
    case "noScreen": return { text: "Tempo de tela ligada igual a zero — o dreno por hora não pode ser calculado.", strong: [] };
    case "noVoltage": return { text: "Consumo informado em mWh sem tensão nominal — não é possível converter para mAh.", strong: [] };
    case "drain": return { text: `Dreno relativo de ${fmt(r.value)} %/h, ${r.value >= r.limit ? "acima do" : "abaixo do"} limiar de ${r.limit} %/h.${norm}`, strong: [`${fmt(r.value)} %/h`, `${r.limit} %/h`] };
    case "crashes": return { text: `${r.value} falha(s) nos últimos 7 dias, limiar de ${r.limit}.${norm}`, strong: [`${r.value} falha(s)`] };
    case "frames": return { text: `Quadros perdidos em ${fmt(r.value)} %, acima do limiar de ${r.limit} %.${norm}`, strong: [`${fmt(r.value)} %`] };
    default: return { text: `Dreno relativo de ${fmt(c.relativeDrain ?? 0)} %/h e nenhum limiar preventivo atingido.${norm}`, strong: [`${fmt(c.relativeDrain ?? 0)} %/h`] };
  }
}

const KEY = "seldon-favorites";
export function useFavorites() {
  const [favs, setFavs] = useState<string[]>([]);
  useEffect(() => {
    try { setFavs(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch { /* ignore */ }
  }, []);
  const toggle = (id: string) =>
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  return { favs, toggle };
}
