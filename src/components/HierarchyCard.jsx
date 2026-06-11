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
        className="bg-white rounded-[18px] border border-slate-100 shadow-card cursor-pointer relative transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5">
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-[18px]" style={{ background: accentColor }} />
        <div className="pl-5 pr-4 py-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-2.5 items-center flex-1 min-w-0">
              <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center shrink-0" style={{ background: accentColor + "18" }}>
                <Icon size={20} color={accentColor} strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <div className="font-display font-semibold text-[15px] text-slate-800 truncate tracking-[-0.1px]">{title}</div>
                {subtitle && <div className="text-[11px] text-slate-400 mt-0.5">{subtitle}</div>}
              </div>
            </div>
            {/* Butoane acțiune */}
            <div className="flex items-center gap-0.5 shrink-0 ml-1">
              <button onClick={e => { e.stopPropagation(); setMenu(m => !m); }} className="cad-icon-btn" title="Mai multe">
                <MoreHorizontal size={17} />
              </button>
            </div>
          </div>
          {stats && stats.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {stats.map((s, i) => (
                <span key={i} className="text-[11px] bg-slate-50 text-slate-500 px-2.5 py-0.5 rounded-lg font-semibold">{s}</span>
              ))}
            </div>
          )}
        </div>
        {menu && (
          <div ref={menuRef} onClick={e => e.stopPropagation()} className="absolute top-11 right-2.5 bg-white rounded-xl shadow-dropdown border border-slate-100 z-[50] min-w-[150px] overflow-hidden">
            <button onClick={() => { setMenu(false); onEdit(); }}
              className="flex gap-2 items-center w-full px-3.5 py-2.5 bg-transparent border-none cursor-pointer text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors duration-100">
              <Pencil size={14} /> Editează
            </button>
            <hr className="border-none border-t border-slate-100 my-0.5" />
            <button onClick={() => { setMenu(false); setDel(true); }}
              className="flex gap-2 items-center w-full px-3.5 py-2.5 bg-transparent border-none cursor-pointer text-xs font-medium text-red-600 hover:bg-red-50 transition-colors duration-100">
              <Trash2 size={14} /> Șterge
            </button>
          </div>
        )}
      </div>
      <ConfirmDialog isOpen={del} title="Confirmi ștergerea?" message={confirmMsg} onConfirm={() => { onDelete(); setDel(false); }} onCancel={() => setDel(false)} />
    </>
  );
}
