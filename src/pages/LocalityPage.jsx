import { useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { Btn, StatMini, Empty, Breadcrumb, BackBtn } from "../components/ui/index.jsx";
import SectorCard from "../components/SectorCard.jsx";
import SectorForm from "../components/forms/SectorForm.jsx";
import ActivityForm from "../components/forms/ActivityForm.jsx";
import { avgProgress } from "../utils/format.js";

export default function LocalityPage({ financeId, uatId, localityId, onNav }) {
  const { getFinanceById, getUatById, getLocalityById, getSectorsByLocality } = useApp();
  const finance  = getFinanceById(financeId);
  const uat      = getUatById(uatId);
  const locality = getLocalityById(localityId);
  const sectors  = getSectorsByLocality(localityId);
  const [showForm,  setShowForm]  = useState(false);
  const [editS,     setEditS]     = useState(null);
  const [actSector, setActSector] = useState(null);

  if (!locality) return <div className="p-6"><Btn variant="secondary" onClick={() => onNav("uat", { financeId, uatId })}>← Înapoi</Btn></div>;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-7">
      <Breadcrumb items={[
        { label: "Dashboard", onClick: () => onNav("dashboard") },
        { label: finance?.name, onClick: () => onNav("finance", { financeId }) },
        { label: uat?.name, onClick: () => onNav("uat", { financeId, uatId }) },
        { label: locality.name },
      ]} />
      <div className="mb-5">
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <BackBtn onClick={() => onNav("uat", { financeId, uatId })} />
            <div className="hidden sm:block min-w-0">
              <h1 className="font-display font-bold text-[26px] text-slate-800 m-0 tracking-[-0.3px]">{locality.name}</h1>
              <p className="text-xs text-slate-400 mt-1">UAT {uat?.name} · {finance?.name}</p>
            </div>
          </div>
          <Btn onClick={() => { setEditS(null); setShowForm(true); }}>
            <Plus size={15} /><span className="hidden sm:inline">Sector nou</span>
          </Btn>
        </div>
        <div className="sm:hidden mt-3">
          <h1 className="font-display font-bold text-[26px] text-slate-800 m-0 tracking-[-0.3px]">{locality.name}</h1>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">UAT {uat?.name} · {finance?.name}</p>
        </div>
      </div>

      {sectors.length > 0 && (
        <div className="grid gap-2.5 mb-5 grid-cols-[repeat(auto-fit,minmax(120px,1fr))]">
          <StatMini label="Sectoare"      value={sectors.length}                                                           color="teal" />
          <StatMini label="Progres mediu" value={`${avgProgress(sectors)}%`}                                               color="blue" />
          <StatMini label="Active"        value={sectors.filter(s => ["În lucru","Completări"].includes(s.status)).length} color="amber" />
          <StatMini label="Finalizate"    value={sectors.filter(s => s.status === "Finalizat").length}                     color="emerald" />
        </div>
      )}

      {sectors.length === 0
        ? <Empty icon={MapPin} title="Niciun sector" subtitle="Adaugă primul sector pentru această localitate."
            action={<Btn onClick={() => setShowForm(true)}><Plus size={15} /> Adaugă sector</Btn>} />
        : <div className="grid gap-3.5 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {sectors.map(s => (
              <SectorCard key={s.id} sector={s}
                onSelect={() => onNav("sector", { financeId, uatId, localityId, sectorId: s.id })}
                onEdit={(sx) => { setEditS(sx); setShowForm(true); }}
                onActivity={(sx) => setActSector(sx)} />
            ))}
          </div>
      }

      <SectorForm isOpen={showForm} onClose={() => { setShowForm(false); setEditS(null); }} localityId={localityId} editSector={editS} />
      {actSector && (
        <ActivityForm isOpen onClose={() => setActSector(null)} sector={actSector} locality={locality} uat={uat} finance={finance} />
      )}
    </div>
  );
}
