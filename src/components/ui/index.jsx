import { useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import { STATUS_STYLES } from "../../utils/constants.js";

export function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || { bg: "#f1f5f9", color: "#64748b" };
  return (
    <span className="cad-badge" style={{ background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

export function ProgressBar({ value, showLabel, size = "md" }) {
  const pct = Math.min(100, Math.max(0, parseFloat(value) || 0));
  const h   = size === "sm" ? 6 : size === "lg" ? 12 : 8;
  const col = pct >= 100 ? "#059669" : pct >= 75 ? "#0d9488" : pct >= 50 ? "#0891b2" : pct >= 25 ? "#2563eb" : "#94a3b8";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 overflow-hidden bg-slate-100" style={{ height: h, borderRadius: h }}>
        <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: h, transition: "width .4s ease" }} />
      </div>
      {showLabel && (
        <span className="font-mono font-bold text-slate-600 text-right" style={{ fontSize: 11, minWidth: 36 }}>{pct}%</span>
      )}
    </div>
  );
}

export function StatMini({ label, value, color = "teal" }) {
  const C = {
    teal:    ["#f0fdfa", "#0d9488"],
    blue:    ["#eff6ff", "#2563eb"],
    emerald: ["#ecfdf5", "#059669"],
    amber:   ["#fffbeb", "#d97706"],
    purple:  ["#faf5ff", "#9333ea"],
    slate:   ["#f8fafc", "#475569"],
  };
  const [bg, fg] = C[color] || C.teal;
  return (
    <div className="rounded-xl p-3" style={{ background: bg }}>
      <div className="cad-label" style={{ color: fg, opacity: 0.7, marginBottom: 4 }}>{label}</div>
      <div className="font-display font-bold leading-none text-[22px] tracking-[-0.3px]" style={{ color: fg }}>{value}</div>
    </div>
  );
}

const BTN_BASE = "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold cursor-pointer font-sans transition-all duration-150 whitespace-nowrap shrink-0 border-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]";
const BTN_VARIANTS = {
  primary:   "bg-teal-600 text-white hover:bg-teal-700 hover:shadow-[0_2px_8px_rgba(13,148,136,0.3)]",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  ghost:     "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700",
  danger:    "bg-red-50 text-red-600 hover:bg-red-100",
};

export function Btn({ children, onClick, variant = "primary", style: extra, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`${BTN_BASE} ${BTN_VARIANTS[variant] || BTN_VARIANTS.primary}`}
      style={extra}>
      {children}
    </button>
  );
}

export function Input({ error, style: ex, ...r }) {
  return <input className={`cad-input${error ? " cad-input-error" : ""}`} style={ex} {...r} />;
}
export function Select({ error, style: ex, ...r }) {
  return <select className={`cad-input${error ? " cad-input-error" : ""}`} style={{ ...ex, appearance: "auto" }} {...r} />;
}
export function Textarea({ error, style: ex, ...r }) {
  return <textarea className={`cad-input${error ? " cad-input-error" : ""}`} style={{ minHeight: 72, resize: "vertical", ...ex }} {...r} />;
}

export function DateInput({ value, onChange }) {
  const toDisplay = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };
  const [display, setDisplay] = useState(() => toDisplay(value));

  const handleChange = (e) => {
    let v = e.target.value.replace(/[^\d/]/g, "");
    if (v.length === 2 && display.length === 1) v = v + "/";
    if (v.length === 5 && display.length === 4) v = v + "/";
    setDisplay(v);
    const parts = v.split("/");
    if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
      const [d, m, y] = parts;
      onChange(`${y}-${m}-${d}`);
    }
  };

  return <input value={display} onChange={handleChange} placeholder="zz/ll/aaaa" maxLength={10} className="cad-input" />;
}

export function Field({ label, children, error }) {
  return (
    <div className="mb-3.5">
      <label className="cad-label">{label}</label>
      {children}
      {error && <div className="text-[11px] text-red-600 mt-0.5">{error}</div>}
    </div>
  );
}

export function Modal({ isOpen, onClose, title, subtitle, children, footer, maxWidth = 560 }) {
  if (!isOpen) return null;
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/35 backdrop-blur-sm z-[100] flex items-end justify-center">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-t-3xl w-full max-h-[92vh] overflow-y-auto animate-slide-up shadow-modal" style={{ maxWidth }}>
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 sticky top-0 bg-white z-[1] rounded-t-3xl">
          <div>
            <div className="font-display font-semibold text-[17px] text-slate-800 tracking-[-0.2px]">{title}</div>
            {subtitle && <div className="text-[13px] text-slate-400 mt-0.5">{subtitle}</div>}
          </div>
          <button onClick={onClose} className="cad-icon-btn"><X size={18} /></button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="px-5 pb-5 flex gap-2.5 sticky bottom-0 bg-white border-t border-slate-100 pt-3">{footer}</div>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div onClick={onCancel} className="fixed inset-0 bg-black/35 backdrop-blur-sm z-[200] flex items-end justify-center">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-t-[20px] px-5 pt-6 pb-7 w-full max-w-[480px] shadow-modal animate-slide-up">
        <div className="font-display font-semibold text-[17px] text-slate-800 mb-2 tracking-[-0.2px]">{title}</div>
        <div className="text-sm text-slate-500 mb-5 leading-relaxed">{message}</div>
        <div className="flex gap-2.5">
          <Btn variant="secondary" onClick={onCancel} style={{ flex: 1, justifyContent: "center" }}>Anulează</Btn>
          <Btn variant="danger"    onClick={onConfirm} style={{ flex: 1, justifyContent: "center" }}>Șterge</Btn>
        </div>
      </div>
    </div>
  );
}

export function Empty({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
      <div className="w-16 h-16 rounded-[20px] bg-teal-50 flex items-center justify-center mb-4">
        <Icon size={30} color="#0d9488" strokeWidth={1.5} />
      </div>
      <div className="font-display font-semibold text-[17px] text-slate-700 mb-1.5 tracking-[-0.2px]">{title}</div>
      {subtitle && <div className="text-sm text-slate-400 mb-5 leading-relaxed">{subtitle}</div>}
      {action}
    </div>
  );
}

export function BackBtn({ onClick }) {
  return (
    <button onClick={onClick}
      className={`${BTN_BASE} ${BTN_VARIANTS.secondary}`}>
      <ArrowLeft size={15} /><span className="hidden sm:inline">Înapoi</span>
    </button>
  );
}

export function Breadcrumb({ items }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="opacity-50">/</span>}
          {item.onClick
            ? <span className="cursor-pointer text-teal-600 hover:text-teal-700 transition-colors" onClick={item.onClick}>{item.label}</span>
            : <span className="text-slate-700 font-semibold">{item.label}</span>
          }
        </span>
      ))}
    </div>
  );
}
