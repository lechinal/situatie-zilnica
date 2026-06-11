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
        className="bg-white rounded-2xl border border-slate-100 shadow-card cursor-pointer transition-all duration-200 relative hover:border-teal-200 hover:-translate-y-px">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2.5">
            <div className="flex gap-2.5">
              <div className="w-8 h-8 rounded-[10px] bg-teal-50 flex items-center justify-center shrink-0">
                <MapPin size={16} color="#0d9488" strokeWidth={2} />
              </div>
              <div>
                <div className="font-display font-semibold text-[15px] text-slate-800 tracking-[-0.1px]">
                  Sector {sector.sectorNumber}
                </div>
                <div className="text-[11px] text-slate-500">{sector.zoneType}</div>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <StatusBadge status={sector.status} />
              <button onClick={e => { e.stopPropagation(); setMenu(m => !m); }} className="cad-icon-btn">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          <ProgressBar value={sector.progress} showLabel size="sm" />

          <div className="flex justify-between items-center mt-2.5 pt-2.5 border-t border-slate-50">
            <span className="text-[10px] text-slate-400">{sector.updatedAt ? fmtDate(sector.updatedAt) : "—"}</span>
            <button onClick={e => { e.stopPropagation(); onActivity(sector); }}
              className="flex items-center gap-1 text-[11px] text-teal-600 font-bold bg-transparent border-none cursor-pointer rounded-md px-1.5 py-0.5 hover:bg-teal-50 transition-colors duration-100">
              <Plus size={13} strokeWidth={2.5} /> Activitate
            </button>
          </div>
        </div>

        {menu && (
          <div ref={menuRef} onClick={e => e.stopPropagation()} className="absolute top-11 right-2 bg-white rounded-xl shadow-dropdown border border-slate-100 z-[50] min-w-[155px] overflow-hidden">
            <button onClick={() => { setMenu(false); onActivity(sector); }}
              className="flex gap-2 items-center w-full px-3 py-2 bg-transparent border-none cursor-pointer text-xs font-medium text-teal-600 hover:bg-teal-50 transition-colors duration-100">
              <Plus size={13} /> Activitate nouă
            </button>
            <hr className="border-none border-t border-slate-100 my-0.5" />
            <button onClick={() => { setMenu(false); onEdit(sector); }}
              className="flex gap-2 items-center w-full px-3 py-2 bg-transparent border-none cursor-pointer text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors duration-100">
              <Pencil size={13} /> Editează
            </button>
            <hr className="border-none border-t border-slate-100 my-0.5" />
            <button onClick={() => { setMenu(false); setDel(true); }}
              className="flex gap-2 items-center w-full px-3 py-2 bg-transparent border-none cursor-pointer text-xs font-medium text-red-600 hover:bg-red-50 transition-colors duration-100">
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
