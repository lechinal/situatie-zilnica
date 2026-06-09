import { useState } from "react";
import { Home, Plus } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { Btn, StatMini, Empty, Breadcrumb, BackBtn } from "../components/ui/index.jsx";
import HierarchyCard from "../components/HierarchyCard.jsx";
import LocalityForm from "../components/forms/LocalityForm.jsx";
import { avgProgress } from "../utils/format.js";

export default function UatPage({ financeId, uatId, onNav }) {
  const { getFinanceById, getUatById, getLocalitiesByUat, getSectorsByLocality, deleteLocality } = useApp();
  const finance    = getFinanceById(financeId);
  const uat        = getUatById(uatId);
  const localities = getLocalitiesByUat(uatId);
  const [showForm, setShowForm] = useState(false);
  const [editL,    setEditL]    = useState(null);

  if (!uat) return <div className="p-6"><Btn variant="secondary" onClick={() => onNav("finance", { financeId })}>← Înapoi</Btn></div>;

  const allSectors = localities.flatMap(l => getSectorsByLocality(l.id));

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-7">
      <Breadcrumb items={[
        { label: "Dashboard", onClick: () => onNav("dashboard") },
        { label: finance?.name, onClick: () => onNav("finance", { financeId }) },
        { label: uat.name },
      ]} />
      <div className="flex justify-between items-center mb-5 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <BackBtn onClick={() => onNav("finance", { financeId })} />
          <div className="min-w-0">
            <h1 className="font-display font-bold text-[26px] text-slate-800 m-0 tracking-[-0.3px]">UAT {uat.name}</h1>
            <p className="text-xs text-slate-400 mt-1">{finance?.name}</p>
          </div>
        </div>
        <Btn onClick={() => { setEditL(null); setShowForm(true); }}><Plus size={15} /> Localitate nouă</Btn>
      </div>

      {localities.length > 0 && (
        <div className="grid gap-2.5 mb-5 grid-cols-[repeat(auto-fit,minmax(120px,1fr))]">
          <StatMini label="Localități"    value={localities.length}                                        color="teal" />
          <StatMini label="Sectoare"      value={allSectors.length}                                        color="blue" />
          <StatMini label="Progres mediu" value={`${avgProgress(allSectors)}%`}                            color="purple" />
          <StatMini label="Finalizate"    value={allSectors.filter(s => s.status === "Finalizat").length}  color="emerald" />
        </div>
      )}

      {localities.length === 0
        ? <Empty icon={Home} title="Nicio localitate" subtitle="Adaugă prima localitate pentru acest UAT."
            action={<Btn onClick={() => setShowForm(true)}><Plus size={15} /> Adaugă localitate</Btn>} />
        : <div className="grid gap-3.5 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
            {localities.map(l => {
              const lSectors = getSectorsByLocality(l.id);
              return (
                <HierarchyCard key={l.id} icon={Home} title={l.name} accentColor="#9333ea"
                  stats={[`${lSectors.length} sectoare`, `Progres ${avgProgress(lSectors)}%`, `${lSectors.filter(s => s.status === "Finalizat").length} finalizate`]}
                  onSelect={() => onNav("locality", { financeId, uatId, localityId: l.id })}
                  onEdit={() => { setEditL(l); setShowForm(true); }}
                  onDelete={() => deleteLocality(l.id)}
                  confirmMsg={`Vei șterge localitatea "${l.name}" și toate sectoarele aferente.`}
                />
              );
            })}
          </div>
      }
      <LocalityForm isOpen={showForm} onClose={() => { setShowForm(false); setEditL(null); }} uatId={uatId} editLocality={editL} />
    </div>
  );
}
