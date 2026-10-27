import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { getDevice } from "@/data/frota";
import { classify } from "@/domain/fleet";
import { STATUS_CLASS, STATUS_LABEL, explain, fmt, useFavorites } from "@/lib/fleet-ui";

export const Route = createFileRoute("/device/$id")({
  loader: ({ params }) => {
    const device = getDevice(params.id);
    if (!device) throw notFound();
    return { device };
  },
  head: ({ params }) => ({
    meta: [
      { title: `${params.id} — Seldon Fleet` },
      { name: "description", content: `Indicadores e justificativa do estado do dispositivo ${params.id}.` },
      { property: "og:title", content: `${params.id} — Seldon Fleet` },
      { property: "og:description", content: "Consumo normalizado, falhas, quadros perdidos e classificação." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DeviceDetail,
});

function Bold({ text, strong }: { text: string; strong: string[] }) {
  if (!strong.length) return <>{text}</>;
  const re = new RegExp(`(${strong.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")}|mWh)`, "g");
  return <>{text.split(re).map((p, i) => (strong.includes(p) || p === "mWh" ? <strong key={i}>{p}</strong> : p))}</>;
}

function DeviceDetail() {
  const { device: d } = Route.useLoaderData();
  const router = useRouter();
  const c = classify(d);
  const ex = explain(c, d);
  const { favs, toggle } = useFavorites();
  const fav = favs.includes(d.id);
  const date = new Date(d.lastContact);
  const pad = (n: number) => String(n).padStart(2, "0");
  const last = `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())} UTC`;

  const metrics: [string, string, string][] = [
    ["Consumo", c.absoluteDrain != null ? fmt(c.absoluteDrain, 0) : "—", "mAh/h"],
    ["Capacidade", d.batteryCapacityMah ? String(d.batteryCapacityMah) : "—", "mAh"],
    ["Tela ligada", String(d.screenOnMinutes), "min"],
    ["Quadros perdidos", fmt(d.droppedFramesPct), "%"],
    ["Falhas (7d)", String(d.crashes7d), ""],
    ["Nível de API", String(d.apiLevel), ""],
  ];

  return (
    <main className="app-shell detail-glow">
      <button onClick={() => router.history.back()} className="mb-6 font-mono text-primary">← Frota</button>
      <h1 className="text-4xl font-bold tracking-tight">{d.id}</h1>
      <p className="mt-1 text-muted-foreground">{d.model} · {d.chipset} · tier {d.tier}</p>

      <section className={`reason-card mt-6 ${STATUS_CLASS[c.status]}`}>
        <p className="eyebrow status-text">▲ {STATUS_LABEL[c.status]}</p>
        <p className="mt-2 text-lg leading-relaxed"><Bold {...ex} /></p>
        {c.relativeDrain != null && c.reason.kind !== "drain" && c.reason.kind !== "none" && (
          <p className="mt-2 text-sm text-muted-foreground">Dreno relativo: {fmt(c.relativeDrain)} %/h</p>
        )}
      </section>

      <dl className="panel mt-6 grid grid-cols-2">
        {metrics.map(([k, v, u], i) => (
          <div key={k} className={`p-4 ${i % 2 === 0 ? "border-r" : ""} ${i < 4 ? "border-b" : ""}`}>
            <dt className="eyebrow">{k}</dt>
            <dd className="mt-2 font-mono text-xl">{v} <span className="text-sm text-muted-foreground">{u}</span></dd>
          </div>
        ))}
      </dl>

      <button onClick={() => toggle(d.id)} className="fav-button mt-6" data-on={fav}>
        ★ {fav ? "Favorito · persistido" : "Marcar como favorito"}
      </button>
      <p className="eyebrow mt-4 text-center">Último contato · {last}</p>
    </main>
  );
}
