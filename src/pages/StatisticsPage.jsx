import { Sun, CalendarDays, Calendar, BarChart2, Folder } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { StatMini } from "../components/ui/index.jsx";
import { formatHours, fmtDateLong } from "../utils/format.js";

function SectionTitle({ icon: Icon, color, bg, children }) {
  return (
    <div className="flex items-center gap-2.5 mb-3.5">
      <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center shrink-0" style={{ background: bg }}>
        <Icon size={15} color={color} strokeWidth={2} />
      </div>
      <h2 className="font-display font-semibold text-base text-slate-700 m-0">{children}</h2>
    </div>
  );
}

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
    { l: "Activități", v: count,                c: "teal"  },
    { l: "Imobile",    v: buildings,            c: "amber" },
    { l: "Ore teren",  v: formatHours(fieldH),  c: "teal"  },
    ...(!noTravel ? [{ l: "Deplasare", v: formatHours(travelH), c: "blue" }] : []),
    { l: "Ore birou",  v: formatHours(officeH), c: "slate" },
  ];

  const statusCounts = sectors.reduce((acc, s) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc; }, {});
  const SC = { "Neînceput": "slate", "În lucru": "blue", "Completări": "amber", "La unit": "purple", "La verificat": "amber", "Finalizat": "emerald" };

  const periods = [
    { title: "Astăzi",            Icon: Sun,          color: "#d97706", bg: "#fffbeb", stats: calc(todayActs), noT: false },
    { title: "Săptămâna curentă", Icon: CalendarDays, color: "#2563eb", bg: "#eff6ff", stats: calc(weekActs),  noT: true  },
    { title: "Luna curentă",      Icon: Calendar,     color: "#9333ea", bg: "#faf5ff", stats: calc(monthActs), noT: false },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-7">
      <h1 className="font-display font-bold text-[30px] text-slate-800 mb-1.5 tracking-[-0.5px]">Statistici</h1>
      <p className="text-[13px] text-slate-400 mb-6">{fmtDateLong(now.toISOString())}</p>

      <div className="cad-stats-row">
        {periods.map(({ title, Icon, color, bg, stats, noT }) => (
          <div key={title} className="cad-card p-5 mb-3.5">
            <SectionTitle icon={Icon} color={color} bg={bg}>{title}</SectionTitle>
            <div className="grid gap-2.5 grid-cols-[repeat(auto-fit,minmax(100px,1fr))]">
              {items(stats, noT).map(s => <StatMini key={s.l} label={s.l} value={s.v} color={s.c} />)}
            </div>
          </div>
        ))}
      </div>

      <div className="cad-card p-5 mb-3.5">
        <SectionTitle icon={BarChart2} color="#0d9488" bg="#f0fdfa">Situație sectoare</SectionTitle>
        <div className="grid gap-2.5 grid-cols-[repeat(auto-fit,minmax(110px,1fr))]">
          {Object.entries(statusCounts).map(([status, count]) => (
            <StatMini key={status} label={status} value={count} color={SC[status] || "slate"} />
          ))}
          <StatMini label="Total" value={sectors.length} color="teal" />
        </div>
      </div>

      {finances.length > 0 && (
        <div className="cad-card p-5">
          <SectionTitle icon={Folder} color="#0d9488" bg="#f0fdfa">Per finanțare</SectionTitle>
          {finances.map(fin => {
            const fUatIds = uats.filter(u => u.financeId === fin.id).map(u => u.id);
            const fLocIds = localities.filter(l => fUatIds.includes(l.uatId)).map(l => l.id);
            const fSecIds = new Set(sectors.filter(s => fLocIds.includes(s.localityId)).map(s => s.id));
            const fActs   = activities.filter(a => fSecIds.has(a.sectorId));
            const fStats  = calc(fActs);
            return (
              <div key={fin.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                <div className="font-bold text-slate-700 text-[13px] min-w-[100px]">{fin.name}</div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    `${fUatIds.length} UAT-uri`,
                    `${fSecIds.size} sectoare`,
                    fStats.count > 0 && `${fStats.count} activități`,
                    fStats.buildings > 0 && `${fStats.buildings} imobile`,
                    fStats.fieldH > 0 && `${formatHours(fStats.fieldH)} teren`,
                  ].filter(Boolean).map(t => (
                    <span key={t} className="text-[11px] bg-slate-50 text-slate-500 px-2.5 py-0.5 rounded-lg">{t}</span>
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
