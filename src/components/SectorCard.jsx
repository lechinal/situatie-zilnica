import { useState, useEffect, useRef } from "react";
import { MapPin, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { StatusBadge, ProgressBar, ConfirmDialog } from "./ui/index.jsx";
import { fmtDate } from "../utils/format.js";

export default function SectorCard({ sector, onSelect, onEdit, onActivity }) {
  const { deleteSector } = useApp();
  const [menu, setMenu] = useState(false);
  const [del,  setDel]  = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menu) return;
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menu]);

  return (
    <>
      <div onClick={onSelect}
        style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,.04)", cursor: "pointer", transition: "all .2s", position: "relative" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#99f6e4"; e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.transform = "translateY(0)"; }}>
        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: "#f0fdfa", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MapPin size={16} color="#0d9488" strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 15, color: "#1e293b", letterSpacing: "-0.1px" }}>Sector {sector.sectorNumber}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{sector.zoneType}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <StatusBadge status={sector.status} />
              <button onClick={e => { e.stopPropagation(); setMenu(m => !m); }} className="cad-icon-btn">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
          <ProgressBar value={sector.progress} showLabel size="sm" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 10, borderTop: "1px solid #f8fafc" }}>
            <span style={{ fontSize: 10, color: "#94a3b8" }}>{sector.updatedAt ? fmtDate(sector.updatedAt) : "—"}</span>
            <button onClick={e => { e.stopPropagation(); onActivity(sector); }}
              style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#0d9488", fontWeight: 700, background: "none", border: "none", cursor: "pointer", borderRadius: 6, padding: "3px 6px", transition: "background .12s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0fdfa"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              <Plus size={13} strokeWidth={2.5} /> Activitate
            </button>
          </div>
        </div>
        {menu && (
          <div ref={menuRef} onClick={e => e.stopPropagation()} style={{ position: "absolute", top: 44, right: 8, background: "#fff", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,.12)", border: "1px solid #f1f5f9", zIndex: 50, minWidth: 150, overflow: "hidden" }}>
            <button onClick={() => { setMenu(false); onEdit(sector); }} style={{ display: "flex", gap: 8, alignItems: "center", width: "100%", padding: "9px 12px", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#334155", transition: "background .12s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              <Pencil size={13} /> Editează
            </button>
            <button onClick={() => { setMenu(false); onActivity(sector); }} style={{ display: "flex", gap: 8, alignItems: "center", width: "100%", padding: "9px 12px", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#334155", transition: "background .12s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              <Plus size={13} /> Activitate nouă
            </button>
            <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "4px 0" }} />
            <button onClick={() => { setMenu(false); setDel(true); }} style={{ display: "flex", gap: 8, alignItems: "center", width: "100%", padding: "9px 12px", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#dc2626", transition: "background .12s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              <Trash2 size={13} /> Șterge
            </button>
          </div>
        )}
      </div>
      <ConfirmDialog isOpen={del} title="Șterge sectorul?" message={`Vei șterge Sectorul ${sector.sectorNumber} și toate activitățile aferente.`}
        onConfirm={() => { deleteSector(sector.id); setDel(false); }} onCancel={() => setDel(false)} />
    </>
  );
}
