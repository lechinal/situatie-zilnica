import { useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import { STATUS_STYLES } from "../../utils/constants.js";

export function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || { bg: "#f1f5f9", color: "#64748b" };
  return <span style={{ background: s.bg, color: s.color, padding: "2px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700 }}>{status}</span>;
}

export function ProgressBar({ value, showLabel, size = "md" }) {
  const pct = Math.min(100, Math.max(0, parseFloat(value) || 0));
  const h   = size === "sm" ? 6 : size === "lg" ? 12 : 8;
  const col = pct >= 100 ? "#059669" : pct >= 75 ? "#0d9488" : pct >= 50 ? "#0891b2" : pct >= 25 ? "#2563eb" : "#94a3b8";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: h, borderRadius: h, background: "#f1f5f9", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: h, transition: "width .4s ease" }} />
      </div>
      {showLabel && <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 700, color: "#475569", minWidth: 36, textAlign: "right" }}>{pct}%</span>}
    </div>
  );
}

export function StatMini({ label, value, color = "teal" }) {
  const C = { teal: ["#f0fdfa","#0d9488"], blue: ["#eff6ff","#2563eb"], emerald: ["#ecfdf5","#059669"], amber: ["#fffbeb","#d97706"], purple: ["#faf5ff","#9333ea"], slate: ["#f8fafc","#475569"] };
  const [bg, fg] = C[color] || C.teal;
  return (
    <div style={{ background: bg, borderRadius: 12, padding: "12px 14px" }}>
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: fg, opacity: 0.7, marginBottom: 4, fontFamily: "'Inter',sans-serif" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: fg, fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1, letterSpacing: "-0.3px" }}>{value}</div>
    </div>
  );
}

export function Btn({ children, onClick, variant = "primary", style: extra, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`cad-btn cad-btn-${variant}`}
      style={extra}>
      {children}
    </button>
  );
}

const iStyle = (err) => ({ width: "100%", padding: "9px 12px", borderRadius: 10, border: `1.5px solid ${err ? "#fca5a5" : "#e2e8f0"}`, fontSize: 13, color: "#1e293b", background: "#fff", outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border .15s" });
export function Input(props)    { const { error, style: ex, ...r } = props; return <input    style={{ ...iStyle(error), ...ex }} {...r} />; }
export function Select(props)   { const { error, style: ex, ...r } = props; return <select   style={{ ...iStyle(error), ...ex, appearance: "auto" }} {...r} />; }
export function Textarea(props) { const { error, style: ex, ...r } = props; return <textarea style={{ ...iStyle(error), minHeight: 72, resize: "vertical", ...ex }} {...r} />; }

// Input dată cu format dd/mm/yyyy, stocat intern ca YYYY-MM-DD
export function DateInput({ value, onChange }) {
  const toDisplay = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };
  const [display, setDisplay] = useState(() => toDisplay(value));

  const handleChange = (e) => {
    let v = e.target.value.replace(/[^\d/]/g, "");
    // Auto-inserează /
    if (v.length === 2 && display.length === 1) v = v + "/";
    if (v.length === 5 && display.length === 4) v = v + "/";
    setDisplay(v);
    // Convertește la ISO dacă e complet
    const parts = v.split("/");
    if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
      const [d, m, y] = parts;
      onChange(`${y}-${m}-${d}`);
    }
  };

  return (
    <input
      value={display}
      onChange={handleChange}
      placeholder="zz/ll/aaaa"
      maxLength={10}
      style={{ ...iStyle(false) }}
    />
  );
}

export function Field({ label, children, error }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", marginBottom: 6, fontFamily: "'Inter',sans-serif" }}>{label}</label>
      {children}
      {error && <div style={{ fontSize: 11, color: "#dc2626", marginTop: 3 }}>{error}</div>}
    </div>
  );
}

export function Modal({ isOpen, onClose, title, subtitle, children, footer, maxWidth = 560 }) {
  if (!isOpen) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", maxWidth, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,.15)", animation: "slideUp .25s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 16px", borderBottom: "1px solid #f1f5f9", position: "sticky", top: 0, background: "#fff", zIndex: 1, borderRadius: "24px 24px 0 0" }}>
          <div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 17, color: "#1e293b", letterSpacing: "-0.2px" }}>{title}</div>
            {subtitle && <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} className="cad-icon-btn"><X size={18} /></button>
        </div>
        <div style={{ padding: "16px 20px" }}>{children}</div>
        {footer && <div style={{ padding: "0 20px 20px", display: "flex", gap: 10, position: "sticky", bottom: 0, background: "#fff", borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div onClick={onCancel} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "20px 20px 0 0", padding: "24px 20px 28px", width: "100%", maxWidth: 480, boxShadow: "0 -8px 40px rgba(0,0,0,.15)", animation: "slideUp .22s ease" }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 17, color: "#1e293b", marginBottom: 8, letterSpacing: "-0.2px" }}>{title}</div>
        <div style={{ fontSize: 14, color: "#64748b", marginBottom: 20, lineHeight: 1.6 }}>{message}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="secondary" onClick={onCancel} style={{ flex: 1, justifyContent: "center" }}>Anulează</Btn>
          <Btn variant="danger"    onClick={onConfirm} style={{ flex: 1, justifyContent: "center" }}>Șterge</Btn>
        </div>
      </div>
    </div>
  );
}

export function Empty({ icon: Icon, title, subtitle, action }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: "#f0fdfa", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <Icon size={30} color="#0d9488" strokeWidth={1.5} />
      </div>
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 17, color: "#334155", marginBottom: 6, letterSpacing: "-0.2px" }}>{title}</div>
      {subtitle && <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 20, lineHeight: 1.5 }}>{subtitle}</div>}
      {action}
    </div>
  );
}

export function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} className="cad-back-btn">
      <ArrowLeft size={15} /> Înapoi
    </button>
  );
}

export function Breadcrumb({ items }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94a3b8", marginBottom: 8, flexWrap: "wrap" }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 && <span style={{ opacity: 0.5 }}>/</span>}
          {item.onClick
            ? <span style={{ cursor: "pointer", color: "#0d9488" }} onClick={item.onClick}>{item.label}</span>
            : <span style={{ color: "#334155", fontWeight: 600 }}>{item.label}</span>
          }
        </span>
      ))}
    </div>
  );
}
