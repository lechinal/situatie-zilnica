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
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 30, color: "#1e293b", margin: 0, letterSpacing: "-0.5px" }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>{fmtDateLong(new Date().toISOString())}</p>
        </div>
        <Btn onClick={() => { setEditF(null); setShowForm(true); }}><Plus size={15} /> Finanțare nouă</Btn>
      </div>

      {finances.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10, marginBottom: 28 }}>
          <StatMini label="Finanțări"      value={finances.length}  color="teal" />
          <StatMini label="Progres global" value={`${globalAvg}%`}  color="blue" />
          <StatMini label="Active"         value={activeSectors}    color="amber" />
          <StatMini label="Finalizate"     value={doneSectors}      color="emerald" />
        </div>
      )}

      {finances.length === 0
        ? <Empty icon={Folder} title="Nicio finanțare" subtitle="Creează prima finanțare pentru a începe." action={<Btn onClick={() => setShowForm(true)}><Plus size={15} /> Creează finanțare</Btn>} />
        : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
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
