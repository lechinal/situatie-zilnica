import { useState } from "react";
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

  if (!uat) return <div style={{ padding: 24 }}><Btn variant="secondary" onClick={() => onNav("finance", { financeId })}>← Înapoi</Btn></div>;

  const allSectors = localities.flatMap(l => getSectorsByLocality(l.id));

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
      <Breadcrumb items={[
        { label: "Dashboard", onClick: () => onNav("dashboard") },
        { label: finance?.name, onClick: () => onNav("finance", { financeId }) },
        { label: uat.name },
      ]} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <BackBtn onClick={() => onNav("finance", { financeId })} />
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 26, color: "#1e293b", margin: 0, letterSpacing: "-0.3px" }}>UAT {uat.name}</h1>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 0" }}>{finance?.name}</p>
          </div>
        </div>
        <Btn onClick={() => { setEditL(null); setShowForm(true); }}>+ Localitate nouă</Btn>
      </div>

      {localities.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10, marginBottom: 22 }}>
          <StatMini label="Localități"    value={localities.length}                                       color="teal" />
          <StatMini label="Sectoare"      value={allSectors.length}                                       color="blue" />
          <StatMini label="Progres mediu" value={`${avgProgress(allSectors)}%`}                           color="purple" />
          <StatMini label="Finalizate"    value={allSectors.filter(s => s.status === "Finalizat").length} color="emerald" />
        </div>
      )}

      {localities.length === 0
        ? <Empty icon="🏠" title="Nicio localitate" subtitle="Adaugă prima localitate pentru acest UAT." action={<Btn onClick={() => setShowForm(true)}>+ Adaugă localitate</Btn>} />
        : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14 }}>
            {localities.map(l => {
              const lSectors = getSectorsByLocality(l.id);
              return (
                <HierarchyCard key={l.id} icon="🏠" title={l.name} accentColor="#9333ea"
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
