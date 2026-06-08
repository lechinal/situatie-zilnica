import { useApp } from "../context/AppContext.jsx";
import { StatMini } from "../components/ui/index.jsx";
import { formatHours, fmtDateLong } from "../utils/format.js";

export default function StatisticsPage() {
  const { activities, sectors, finances, uats, localities } = useApp();
  const now        = new Date();
  const today      = now.toISOString().split("T")[0];
  const dow        = now.getDay() === 0 ? 6 : now.getDay() - 1;
  const weekStart  = new Date(now); weekStart.setDate(now.getDate() - dow); weekStart.setHours(0,0,0,0);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const calc = (acts) => ({
    count:     acts.length,
    buildings: acts.reduce((s, a) => s + (a.fieldActivity?.intravilanBuildings || 0), 0),
    fieldH:    acts.reduce((s, a) => s + (parseFloat(a.fieldHours)  || 0), 0),
    travelH:   acts.reduce((s, a) => s + (parseFloat(a.travelHours) || 0), 0),
    officeH:   acts.reduce((s, a) => s + (parseFloat(a.officeHours) || 0), 0),
  });

  const todayActs = activities.filter(a => a.date === today);
  const weekActs  = activities.filter(a => new Date(a.date + "T12:00:00") >= weekStart);
  const monthActs = activities.filter(a => new Date(a.date + "T12:00:00") >= monthStart);

  const items = ({ count, buildings, fieldH, travelH, officeH }, noTravel = false) => [
    { l: "Activități", v: count,                c: "teal"   },
    { l: "Imobile",    v: buildings,            c: "amber"  },
    { l: "Ore teren",  v: formatHours(fieldH),  c: "teal"   },
    ...(!noTravel ? [{ l: "Deplasare", v: formatHours(travelH), c: "blue" }] : []),
    { l: "Ore birou",  v: formatHours(officeH), c: "slate"  },
  ];

  const statusCounts = sectors.reduce((acc, s) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc; }, {});
  const SC = { "Neînceput": "slate", "În lucru": "blue", "Completări": "amber", "La unit": "purple", "La verificat": "amber", "Finalizat": "emerald" };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
      <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 30, color: "#1e293b", marginBottom: 6, letterSpacing: "-0.5px" }}>Statistici</h1>
      <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>{fmtDateLong(now.toISOString())}</p>

      <div className="cad-stats-row">
        {[["☀️ Astăzi", calc(todayActs), false], ["📅 Săptămâna curentă", calc(weekActs), true], ["📆 Luna curentă", calc(monthActs), false]].map(([title, stats, noT]) => (
          <div key={title} style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", padding: 20, marginBottom: 14 }}>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 16, color: "#334155", marginBottom: 14, marginTop: 0 }}>{title}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))", gap: 10 }}>
              {items(stats, noT).map(s => <StatMini key={s.l} label={s.l} value={s.v} color={s.c} />)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", padding: 20, marginBottom: 14 }}>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 16, color: "#334155", marginBottom: 14, marginTop: 0 }}>📊 Situație sectoare</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 10 }}>
          {Object.entries(statusCounts).map(([status, count]) => <StatMini key={status} label={status} value={count} color={SC[status] || "slate"} />)}
          <StatMini label="Total" value={sectors.length} color="teal" />
        </div>
      </div>

      {finances.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", padding: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 16, color: "#334155", marginBottom: 14, marginTop: 0 }}>📁 Per finanțare</h2>
          {finances.map(fin => {
            const fUatIds = uats.filter(u => u.financeId === fin.id).map(u => u.id);
            const fLocIds = localities.filter(l => fUatIds.includes(l.uatId)).map(l => l.id);
            const fSecIds = new Set(sectors.filter(s => fLocIds.includes(s.localityId)).map(s => s.id));
            const fActs   = activities.filter(a => fSecIds.has(a.sectorId));
            const fStats  = calc(fActs);
            return (
              <div key={fin.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f8fafc" }}>
                <div style={{ fontWeight: 700, color: "#334155", minWidth: 100, fontSize: 13 }}>{fin.name}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[`${fUatIds.length} UAT-uri`, `${fSecIds.size} sectoare`, fStats.count > 0 && `${fStats.count} activități`, fStats.buildings > 0 && `${fStats.buildings} imobile`, fStats.fieldH > 0 && `${formatHours(fStats.fieldH)} teren`].filter(Boolean).map(t => (
                    <span key={t} style={{ fontSize: 11, background: "#f8fafc", color: "#475569", padding: "2px 10px", borderRadius: 8 }}>{t}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
