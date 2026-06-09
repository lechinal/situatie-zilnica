import { useState, useEffect, useRef } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "./ui/index.jsx";

export default function HierarchyCard({ icon: Icon, title, subtitle, stats, onSelect, onEdit, onDelete, confirmMsg, accentColor = "#0d9488" }) {
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
        style={{ background: "#fff", borderRadius: 18, border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,.05)", cursor: "pointer", position: "relative", transition: "all .2s" }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,.05)"; e.currentTarget.style.transform = "translateY(0)"; }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: accentColor, borderRadius: "18px 0 0 18px" }} />
        <div style={{ padding: "16px 16px 16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flex: 1, minWidth: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: accentColor + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={20} color={accentColor} strokeWidth={2} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 15, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "-0.1px" }}>{title}</div>
                {subtitle && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{subtitle}</div>}
              </div>
            </div>
            <button onClick={e => { e.stopPropagation(); setMenu(m => !m); }} className="cad-icon-btn">
              <MoreHorizontal size={18} />
            </button>
          </div>
          {stats && stats.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              {stats.map((s, i) => (
                <span key={i} style={{ fontSize: 11, background: "#f8fafc", color: "#64748b", padding: "3px 10px", borderRadius: 8, fontWeight: 600 }}>{s}</span>
              ))}
            </div>
          )}
        </div>
        {menu && (
          <div ref={menuRef} onClick={e => e.stopPropagation()} style={{ position: "absolute", top: 44, right: 10, background: "#fff", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,.12)", border: "1px solid #f1f5f9", zIndex: 50, minWidth: 140, overflow: "hidden" }}>
            <button onClick={() => { setMenu(false); onEdit(); }} style={{ display: "flex", gap: 8, alignItems: "center", width: "100%", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#334155", transition: "background .12s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              <Pencil size={14} /> Editează
            </button>
            <button onClick={() => { setMenu(false); setDel(true); }} style={{ display: "flex", gap: 8, alignItems: "center", width: "100%", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#dc2626", transition: "background .12s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              <Trash2 size={14} /> Șterge
            </button>
          </div>
        )}
      </div>
      <ConfirmDialog isOpen={del} title="Confirmi ștergerea?" message={confirmMsg} onConfirm={() => { onDelete(); setDel(false); }} onCancel={() => setDel(false)} />
    </>
  );
}
