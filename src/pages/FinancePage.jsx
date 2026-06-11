import { useState } from "react";
import { Building2, Plus } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { Btn, StatMini, Empty, Breadcrumb, BackBtn } from "../components/ui/index.jsx";
import HierarchyCard from "../components/HierarchyCard.jsx";
import UatForm from "../components/forms/UatForm.jsx";
import { avgProgress } from "../utils/format.js";

export default function FinancePage({ financeId, onNav }) {
  const { getFinanceById, getUatsByFinance, getSectorsByFinance, deleteUat, localities, sectors: allSectors } = useApp();
  const finance = getFinanceById(financeId);
  const uats    = getUatsByFinance(financeId);
  const sectors = getSectorsByFinance(financeId);
  const [showForm, setShowForm] = useState(false);
  const [editU,    setEditU]    = useState(null);

  if (!finance) return <div className="p-6"><Btn variant="secondary" onClick={() => onNav("dashboard")}>← Înapoi</Btn></div>;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-7">
      <Breadcrumb items={[{ label: "Dashboard", onClick: () => onNav("dashboard") }, { label: finance.name }]} />
      <div className="mb-5">
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <BackBtn onClick={() => onNav("dashboard")} />
            <div className="hidden sm:block min-w-0">
              <h1 className="font-display font-bold text-[26px] text-slate-800 m-0 tracking-[-0.3px]">{finance.name}</h1>
              {finance.description && <p className="text-xs text-slate-400 mt-1">{finance.description}</p>}
            </div>
          </div>
          <Btn onClick={() => { setEditU(null); setShowForm(true); }}>
            <Plus size={15} /><span className="hidden sm:inline">UAT nou</span>
          </Btn>
        </div>
        <div className="sm:hidden mt-3">
          <h1 className="font-display font-bold text-[26px] text-slate-800 m-0 tracking-[-0.3px]">{finance.name}</h1>
          {finance.description && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{finance.description}</p>}
        </div>
      </div>

      {uats.length > 0 && (
        <div className="grid gap-2.5 mb-5 grid-cols-[repeat(auto-fit,minmax(120px,1fr))]">
          <StatMini label="UAT-uri"       value={uats.length}                                        color="teal" />
          <StatMini label="Sectoare"      value={sectors.length}                                     color="blue" />
          <StatMini label="Progres mediu" value={`${avgProgress(sectors)}%`}                         color="purple" />
          <StatMini label="Finalizate"    value={sectors.filter(s => s.status === "Finalizat").length} color="emerald" />
        </div>
      )}

      {uats.length === 0
        ? <Empty icon={Building2} title="Niciun UAT" subtitle="Adaugă primul UAT pentru această finanțare."
            action={<Btn onClick={() => setShowForm(true)}><Plus size={15} /> Adaugă UAT</Btn>} />
        : <div className="grid gap-3.5 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
            {uats.map(u => {
              const uatLocs    = localities.filter(l => l.uatId === u.id);
              const uatLocIds  = uatLocs.map(l => l.id);
              const uatSectors = allSectors.filter(s => uatLocIds.includes(s.localityId));
              return (
                <HierarchyCard key={u.id} icon={Building2} title={u.name} accentColor="#2563eb"
                  stats={[`${uatLocs.length} localități`, `${uatSectors.length} sectoare`, `Progres ${avgProgress(uatSectors)}%`]}
                  onSelect={() => onNav("uat", { financeId, uatId: u.id })}
                  onEdit={() => { setEditU(u); setShowForm(true); }}
                  onDelete={() => deleteUat(u.id)}
                  confirmMsg={`Vei șterge UAT-ul "${u.name}" și toate localitățile și sectoarele aferente.`}
                />
              );
            })}
          </div>
      }
      <UatForm isOpen={showForm} onClose={() => { setShowForm(false); setEditU(null); }} financeId={financeId} editUat={editU} />
    </div>
  );
}
