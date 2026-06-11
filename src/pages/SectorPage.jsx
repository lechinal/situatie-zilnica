import { useState } from "react";
import { ClipboardList, MessageCircle, Check, Plus, Pencil } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { Btn, StatMini, Empty, Breadcrumb, BackBtn, StatusBadge, ProgressBar } from "../components/ui/index.jsx";
import ActivityItem from "../components/ActivityItem.jsx";
import SectorForm from "../components/forms/SectorForm.jsx";
import ActivityForm from "../components/forms/ActivityForm.jsx";
import { fmtDate, formatHours } from "../utils/format.js";
import { genReport } from "../utils/report.js";

export default function SectorPage({ financeId, uatId, localityId, sectorId, onNav }) {
  const { getFinanceById, getUatById, getLocalityById, getSectorById, getActivitiesBySector } = useApp();
  const finance  = getFinanceById(financeId);
  const uat      = getUatById(uatId);
  const locality = getLocalityById(localityId);
  const sector   = getSectorById(sectorId);
  const acts     = getActivitiesBySector(sectorId);
  const [showAct,   setShowAct]   = useState(false);
  const [showEdit,  setShowEdit]  = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!sector) return <div className="p-6"><Btn variant="secondary" onClick={() => onNav("locality", { financeId, uatId, localityId })}>← Înapoi</Btn></div>;

  const totalB  = acts.reduce((s, a) => s + (a.fieldActivity?.intravilanBuildings || 0), 0);
  const totalFH = acts.reduce((s, a) => s + (parseFloat(a.fieldHours)  || 0), 0);
  const totalTH = acts.reduce((s, a) => s + (parseFloat(a.travelHours) || 0), 0);
  const totalOH = acts.reduce((s, a) => s + (parseFloat(a.officeHours) || 0), 0);

  const copyAll = async () => {
    const text = [...acts].sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(a => genReport(a, sector, locality, uat, finance)).join("\n\n");
    try { await navigator.clipboard.writeText(text); setCopiedAll(true); setTimeout(() => setCopiedAll(false), 2000); } catch {}
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-7">
      <Breadcrumb items={[
        { label: "Dashboard", onClick: () => onNav("dashboard") },
        { label: finance?.name, onClick: () => onNav("finance", { financeId }) },
        { label: uat?.name, onClick: () => onNav("uat", { financeId, uatId }) },
        { label: locality?.name, onClick: () => onNav("locality", { financeId, uatId, localityId }) },
        { label: `Sector ${sector.sectorNumber}` },
      ]} />

      <div className="flex justify-between items-center mb-6 gap-3">
        <div className="flex items-center gap-3">
          <BackBtn onClick={() => onNav("locality", { financeId, uatId, localityId })} />
          <div>
            <h1 className="font-display font-bold text-[26px] text-slate-800 m-0 tracking-[-0.3px]">
              Sector {sector.sectorNumber}
            </h1>
            <p className="text-xs text-slate-400 mt-1">{locality?.name} · UAT {uat?.name} · {finance?.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={() => setShowEdit(true)}>
            <Pencil size={15} /><span className="hidden sm:inline">Editează</span>
          </Btn>
          <Btn onClick={() => setShowAct(true)}>
            <Plus size={15} /><span className="hidden sm:inline">Activitate</span>
          </Btn>
        </div>
      </div>

      <div className="cad-sector-2col">
        {/* Fișa sectorului */}
        <div>
          <div className="cad-card p-[22px] mb-4">
            <div className="grid grid-cols-2 gap-4 mb-5">
              {[["Finanțare", finance?.name], ["UAT", uat?.name], ["Localitate", locality?.name], ["Tip zonă", sector.zoneType], ["Actualizat", fmtDate(sector.updatedAt)]].map(([l, v]) => (
                <div key={l}>
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-[0.07em]">{l}</div>
                  <div className="text-[13px] font-semibold text-slate-700">{v || "—"}</div>
                </div>
              ))}
              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-[0.07em]">Status</div>
                <StatusBadge status={sector.status} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[13px] mb-2">
                <span className="font-semibold text-slate-600">Progres sector</span>
                <span className="font-display font-bold text-teal-600 text-base tracking-[-0.3px]">{sector.progress}%</span>
              </div>
              <ProgressBar value={sector.progress} size="lg" />
            </div>
            {acts.length > 0 && (
              <div className="grid grid-cols-2 gap-2 pt-4 mt-4 border-t border-slate-100">
                <StatMini label="Imobile"   value={totalB}               color="amber" />
                <StatMini label="Ore teren" value={formatHours(totalFH)} color="teal" />
                <StatMini label="Deplasare" value={formatHours(totalTH)} color="blue" />
                <StatMini label="Ore birou" value={formatHours(totalOH)} color="slate" />
              </div>
            )}
          </div>
        </div>

        {/* Activități */}
        <div>
          <div className="flex justify-between items-center mb-3.5">
            <h2 className="font-display font-semibold text-base text-slate-700 m-0">
              Istoric activități <span className="text-sm font-normal text-slate-400">({acts.length})</span>
            </h2>
            {acts.length > 0 && (
              <button onClick={copyAll}
                className={`flex gap-1.5 items-center text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer border-none font-sans transition-all duration-150 ${
                  copiedAll ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}>
                {copiedAll ? <><Check size={12} /> Copiat!</> : <><MessageCircle size={12} /> Copiază tot</>}
              </button>
            )}
          </div>
          {acts.length === 0
            ? <Empty icon={ClipboardList} title="Nicio activitate" subtitle="Adaugă prima activitate pentru acest sector." />
            : <div className="flex flex-col gap-3">
                {acts.map(a => <ActivityItem key={a.id} activity={a} sector={sector} locality={locality} uat={uat} finance={finance} />)}
              </div>
          }
        </div>
      </div>

      {showAct && <ActivityForm isOpen onClose={() => setShowAct(false)} sector={sector} locality={locality} uat={uat} finance={finance} />}
      <SectorForm isOpen={showEdit} onClose={() => setShowEdit(false)} localityId={localityId} editSector={sector} />
    </div>
  );
}
