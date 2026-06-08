import { useState } from "react";
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

  if (!finance) return <div style={{ padding: 24 }}><Btn variant="secondary" onClick={() => onNav("dashboard")}>← Înapoi</Btn></div>;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
      <Breadcrumb items={[{ label: "Dashboard", onClick: () => onNav("dashboard") }, { label: finance.name }]} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <BackBtn onClick={() => onNav("dashboard")} />
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 26, color: "#1e293b", margin: 0, letterSpacing: "-0.3px" }}>{finance.name}</h1>
            {finance.description && <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 0" }}>{finance.description}</p>}
          </div>
        </div>
        <Btn onClick={() => { setEditU(null); setShowForm(true); }}>+ UAT nou</Btn>
      </div>

      {uats.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10, marginBottom: 22 }}>
          <StatMini label="UAT-uri"       value={uats.length}                                       color="teal" />
          <StatMini label="Sectoare"      value={sectors.length}                                    color="blue" />
          <StatMini label="Progres mediu" value={`${avgProgress(sectors)}%`}                        color="purple" />
          <StatMini label="Finalizate"    value={sectors.filter(s => s.status === "Finalizat").length} color="emerald" />
        </div>
      )}

      {uats.length === 0
        ? <Empty icon="🏘️" title="Niciun UAT" subtitle="Adaugă primul UAT pentru această finanțare." action={<Btn onClick={() => setShowForm(true)}>+ Adaugă UAT</Btn>} />
        : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
            {uats.map(u => {
              const uatLocs    = localities.filter(l => l.uatId === u.id);
              const uatLocIds  = uatLocs.map(l => l.id);
              const uatSectors = allSectors.filter(s => uatLocIds.includes(s.localityId));
              return (
                <HierarchyCard key={u.id} icon="🏘️" title={u.name} accentColor="#2563eb"
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
