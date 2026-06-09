import { useState } from "react";
import { Folder, Plus } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { Btn, StatMini, Empty } from "../components/ui/index.jsx";
import FinanceCard from "../components/FinanceCard.jsx";
import FinanceForm from "../components/forms/FinanceForm.jsx";
import { avgProgress, fmtDateLong } from "../utils/format.js";

export default function DashboardPage({ onNav }) {
  const { finances, uats, getSectorsByFinance, deleteFinance } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editF,    setEditF]    = useState(null);

  const allSectors    = finances.flatMap(f => getSectorsByFinance(f.id));
  const globalAvg     = avgProgress(allSectors);
  const activeSectors = allSectors.filter(s => ["În lucru","Completări"].includes(s.status)).length;
  const doneSectors   = allSectors.filter(s => s.status === "Finalizat").length;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-7">
      <div className="flex justify-between items-start mb-7 gap-3">
        <div className="min-w-0">
          <h1 className="font-display font-bold text-[30px] text-slate-800 m-0 tracking-[-0.5px]">Dashboard</h1>
          <p className="text-[13px] text-slate-400 mt-1">{fmtDateLong(new Date().toISOString())}</p>
        </div>
        <Btn onClick={() => { setEditF(null); setShowForm(true); }}><Plus size={15} /> Finanțare nouă</Btn>
      </div>

      {finances.length > 0 && (
        <div className="grid gap-2.5 mb-7 grid-cols-[repeat(auto-fit,minmax(130px,1fr))]">
          <StatMini label="Finanțări"      value={finances.length}  color="teal" />
          <StatMini label="Progres global" value={`${globalAvg}%`}  color="blue" />
          <StatMini label="Active"         value={activeSectors}    color="amber" />
          <StatMini label="Finalizate"     value={doneSectors}      color="emerald" />
        </div>
      )}

      {finances.length === 0
        ? <Empty icon={Folder} title="Nicio finanțare" subtitle="Creează prima finanțare pentru a începe."
            action={<Btn onClick={() => setShowForm(true)}><Plus size={15} /> Creează finanțare</Btn>} />
        : <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
            {finances.map(f => (
              <FinanceCard key={f.id} finance={f}
                uats={uats.filter(u => u.financeId === f.id)}
                sectors={getSectorsByFinance(f.id)}
                onSelect={() => onNav("finance", { financeId: f.id })}
                onEdit={() => { setEditF(f); setShowForm(true); }}
                onDelete={() => deleteFinance(f.id)} />
            ))}
          </div>
      }
      <FinanceForm isOpen={showForm} onClose={() => { setShowForm(false); setEditF(null); }} editFinance={editF} />
    </div>
  );
}
