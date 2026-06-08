import { useState } from "react";
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
  const [showForm,   setShowForm]   = useState(false);
  const [editS,      setEditS]      = useState(null);
  const [actSector,  setActSector]  = useState(null);

  if (!locality) return <div style={{ padding: 24 }}><Btn variant="secondary" onClick={() => onNav("uat", { financeId, uatId })}>← Înapoi</Btn></div>;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
      <Breadcrumb items={[
        { label: "Dashboard", onClick: () => onNav("dashboard") },
        { label: finance?.name, onClick: () => onNav("finance", { financeId }) },
        { label: uat?.name, onClick: () => onNav("uat", { financeId, uatId }) },
        { label: locality.name },
      ]} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <BackBtn onClick={() => onNav("uat", { financeId, uatId })} />
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 26, color: "#1e293b", margin: 0, letterSpacing: "-0.3px" }}>{locality.name}</h1>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 0" }}>UAT {uat?.name} · {finance?.name}</p>
          </div>
        </div>
        <Btn onClick={() => { setEditS(null); setShowForm(true); }}>+ Sector nou</Btn>
      </div>

      {sectors.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10, marginBottom: 22 }}>
          <StatMini label="Sectoare"      value={sectors.length}                                                            color="teal" />
          <StatMini label="Progres mediu" value={`${avgProgress(sectors)}%`}                                                color="blue" />
          <StatMini label="Active"        value={sectors.filter(s => ["În lucru","Completări"].includes(s.status)).length}  color="amber" />
          <StatMini label="Finalizate"    value={sectors.filter(s => s.status === "Finalizat").length}                      color="emerald" />
        </div>
      )}

      {sectors.length === 0
        ? <Empty icon="📍" title="Niciun sector" subtitle="Adaugă primul sector pentru această localitate." action={<Btn onClick={() => setShowForm(true)}>+ Adaugă sector</Btn>} />
        : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
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
