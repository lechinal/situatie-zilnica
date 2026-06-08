import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { ConfirmDialog } from "./ui/index.jsx";
import { fmtDate, formatHours } from "../utils/format.js";
import { genReport } from "../utils/report.js";

export default function ActivityItem({ activity, sector, locality, uat, finance }) {
  const { deleteActivity } = useApp();
  const [copied, setCopied] = useState(false);
  const [del,    setDel]    = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(genReport(activity, sector, locality, uat, finance));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <>
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f1f5f9", padding: 14, boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 14, color: "#334155" }}>{fmtDate(activity.date)}</div>
            {activity.team?.length > 0 && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>👥 {activity.team.join(", ")}</div>}
          </div>
          {activity.progressToday > 0 && <span style={{ background: "#f0fdfa", color: "#0d9488", fontSize: 11, fontWeight: 700, fontFamily: "monospace", padding: "2px 10px", borderRadius: 8 }}>+{activity.progressToday}%</span>}
        </div>
        {activity.fieldActivity?.enabled && (
          <div style={{ background: "#f0fdfa", borderRadius: 10, padding: "10px 12px", marginBottom: 8, display: "flex", gap: 10 }}>
            <span style={{ fontSize: 16 }}>🗺️</span>
            <div style={{ fontSize: 12, color: "#0f766e" }}>
              <div style={{ fontWeight: 700 }}>{activity.fieldActivity.interventionType}</div>
              {activity.fieldActivity.intravilanBuildings > 0 && <div>{activity.fieldActivity.intravilanBuildings} imobile</div>}
              {activity.fieldActivity.extravilanElements?.length > 0 && <div>{activity.fieldActivity.extravilanElements.map(e => e.type).join(", ")}</div>}
              <div style={{ fontFamily: "monospace", marginTop: 4, opacity: 0.8 }}>
                {activity.fieldHours > 0 && `🏔 ${formatHours(activity.fieldHours)}`}
                {activity.fieldHours > 0 && activity.travelHours > 0 && "  "}
                {activity.travelHours > 0 && `🚗 ${formatHours(activity.travelHours)}`}
              </div>
            </div>
          </div>
        )}
        {activity.officeActivity?.enabled && (
          <div style={{ background: "#eff6ff", borderRadius: 10, padding: "10px 12px", marginBottom: 8, display: "flex", gap: 10 }}>
            <span style={{ fontSize: 16 }}>🖥️</span>
            <div style={{ fontSize: 12, color: "#1d4ed8" }}>
              <div style={{ fontWeight: 700 }}>{activity.officeActivity.types?.join(", ") || "Birou"}</div>
              {activity.officeActivity.description && <div style={{ opacity: 0.8 }}>{activity.officeActivity.description}</div>}
              {activity.officeHours > 0 && <div style={{ fontFamily: "monospace", marginTop: 4 }}>🕐 {formatHours(activity.officeHours)}</div>}
            </div>
          </div>
        )}
        {activity.observations && (
          <div style={{ background: "#fffbeb", borderRadius: 10, padding: "8px 12px", fontSize: 12, color: "#78350f", fontStyle: "italic" }}>"{activity.observations}"</div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 10, paddingTop: 10, borderTop: "1px solid #f8fafc" }}>
          <button onClick={copy} style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 8, cursor: "pointer", border: "none", fontFamily: "inherit", background: copied ? "#d1fae5" : "#f1f5f9", color: copied ? "#059669" : "#475569", transition: "all .15s" }}>
            {copied ? "✓ Copiat!" : "💬 WhatsApp"}
          </button>
          <button onClick={() => setDel(true)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#cbd5e1", fontSize: 14, padding: 4 }}>🗑</button>
        </div>
      </div>
      <ConfirmDialog isOpen={del} title="Șterge activitatea?" message="Această acțiune nu poate fi anulată."
        onConfirm={() => { deleteActivity(activity.id); setDel(false); }} onCancel={() => setDel(false)} />
    </>
  );
}
