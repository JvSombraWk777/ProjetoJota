import { createFileRoute, Link } from "@tanstack/react-router";
import { getDevices } from "@/data/frota";
import { classify, type DeviceStatus } from "@/domain/fleet";
import { STATUS_CLASS, STATUS_LABEL, useFavorites } from "@/lib/fleet-ui";

type Filter = "ALL" | DeviceStatus | "FAV";
const FILTERS: Filter[] = ["ALL", "OK", "ATENCAO", "CRITICO", "INDETERMINADO", "FAV"];

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): { status?: Filter } =>
    FILTERS.includes(s.status as Filter) && s.status !== "ALL" ? { status: s.status as Filter } : {},
  head: () => ({
    meta: [
      { title: "Seldon Fleet — Painel da frota" },
      { name: "description", content: "Saúde da frota de dispositivos Android: bateria, desempenho e classificação automática." },
      { property: "og:title", content: "Seldon Fleet — Painel da frota" },
      { property: "og:description", content: "Liste, filtre e acompanhe dispositivos OK, em atenção ou críticos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FleetList,
});

function FleetList() {
  const { status = "ALL" } = Route.useSearch();
  const { favs, toggle } = useFavorites();
  const rows = getDevices().map((d) => ({ d, c: classify(d) }));
  const count = (f: Filter) =>
    f === "ALL" ? rows.length : f === "FAV" ? rows.filter((r) => favs.includes(r.d.id)).length : rows.filter((r) => r.c.status === f).length;
  const shown = rows.filter((r) =>
    status === "ALL" ? true : status === "FAV" ? favs.includes(r.d.id) : r.c.status === status,
  );

  return (
    <main className="app-shell">
      <header className="mb-6">
        <p className="eyebrow">Telemetria · {rows.length} dispositivos</p>
        <h1 className="text-4xl font-bold tracking-tight">Seldon Fleet</h1>
      </header>

      <nav className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1">
        {FILTERS.map((f) => (
          <Link key={f} to="/" search={f === "ALL" ? {} : { status: f }} replace
            className="filter-chip" data-active={status === f}>
            {f === "ALL" ? "Todos" : f === "FAV" ? "★ Favoritos" : STATUS_LABEL[f]}
            <span className="font-mono opacity-60">{count(f)}</span>
          </Link>
        ))}
      </nav>

      <ul className="panel divide-y divide-border">
        {shown.length === 0 && <li className="p-6 text-center text-muted-foreground">Nenhum dispositivo neste filtro.</li>}
        {shown.map(({ d, c }) => (
          <li key={d.id} className="flex items-center gap-2">
            <button onClick={() => toggle(d.id)} aria-label={favs.includes(d.id) ? "Desmarcar favorito" : "Marcar favorito"}
              className="fav-star pl-4" data-on={favs.includes(d.id)}>★</button>
            <Link to="/device/$id" params={{ id: d.id }} className="flex flex-1 items-center justify-between py-4 pr-4 transition-colors hover:bg-accent/40">
              <div>
                <p className="font-mono text-base">{d.id}</p>
                <p className="text-sm text-muted-foreground">{d.model} · {d.chipset}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="font-mono text-sm text-muted-foreground">{d.batteryLevel}%</span>
                <span className={`status-chip ${STATUS_CLASS[c.status]}`}>{STATUS_LABEL[c.status]}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
