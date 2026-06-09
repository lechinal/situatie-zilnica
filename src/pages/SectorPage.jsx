import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { ClipboardList, MessageCircle, Check, Plus } from "lucide-react";
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

  if (!sector) return <div style={{ padding: 24 }}><Btn variant="secondary" onClick={() => onNav("locality", { financeId, uatId, localityId })}>← Înapoi</Btn></div>;

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
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
      <Breadcrumb items={[
        { label: "Dashboard", onClick: () => onNav("dashboard") },
        { label: finance?.name, onClick: () => onNav("finance", { financeId }) },
        { label: uat?.name, onClick: () => onNav("uat", { financeId, uatId }) },
        { label: locality?.name, onClick: () => onNav("locality", { financeId, uatId, localityId }) },
        { label: `Sector ${sector.sectorNumber}` },
      ]} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <BackBtn onClick={() => onNav("locality", { financeId, uatId, localityId })} />
          <div>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 26, color: "#1e293b", margin: 0, letterSpacing: "-0.3px" }}>Sector {sector.sectorNumber}</h1>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 0" }}>{locality?.name} · UAT {uat?.name} · {finance?.name}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="ghost" onClick={() => setShowEdit(true)}>Editează</Btn>
          <Btn onClick={() => setShowAct(true)}><Plus size={15} /> Activitate</Btn>
        </div>
      </div>

      <div className="cad-sector-2col">
        {/* Fișa sectorului */}
        <div>
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", padding: 22, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,.05)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              {[["Finanțare", finance?.name], ["UAT", uat?.name], ["Localitate", locality?.name], ["Tip zonă", sector.zoneType], ["Actualizat", fmtDate(sector.updatedAt)]].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{v || "—"}</div>
                </div>
              ))}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", marginBottom: 4 }}>Status</div>
                <StatusBadge status={sector.status} />
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                <span style={{ fontWeight: 600, color: "#475569" }}>Progres sector</span>
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16, color: "#0d9488", letterSpacing: "-0.3px" }}>{sector.progress}%</span>
              </div>
              <ProgressBar value={sector.progress} size="lg" />
            </div>
            {acts.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, paddingTop: 16, marginTop: 16, borderTop: "1px solid #f1f5f9" }}>
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 16, color: "#334155", margin: 0 }}>
              Istoric activități <span style={{ fontSize: 14, fontWeight: 400, color: "#94a3b8" }}>({acts.length})</span>
            </h2>
            {acts.length > 0 && (
              <button onClick={copyAll} style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 8, cursor: "pointer", border: "none", fontFamily: "inherit", background: copiedAll ? "#d1fae5" : "#f1f5f9", color: copiedAll ? "#059669" : "#475569", transition: "all .15s" }}
                onMouseEnter={e => { if (!copiedAll) e.currentTarget.style.background = "#e2e8f0"; }}
                onMouseLeave={e => { if (!copiedAll) e.currentTarget.style.background = "#f1f5f9"; }}>
                {copiedAll ? <><Check size={12} /> Copiat!</> : <><MessageCircle size={12} /> Copiază tot</>}
              </button>
            )}
          </div>
          {acts.length === 0
            ? <Empty icon={ClipboardList} title="Nicio activitate" subtitle="Adaugă prima activitate pentru acest sector." />
            : <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
