import { useState } from "react";
import { Map, Monitor, Mountain, Car, Clock, MessageCircle, Check, Trash2 } from "lucide-react";
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
      <div className="bg-white rounded-[14px] border border-slate-100 p-3.5 shadow-card">
        <div className="flex justify-between items-start mb-2.5">
          <div>
            <div className="font-display font-semibold text-sm text-slate-700">{fmtDate(activity.date)}</div>
            {activity.team?.length > 0 && (
              <div className="text-[11px] text-slate-400 mt-0.5">👥 {activity.team.join(", ")}</div>
            )}
          </div>
          {activity.progressToday > 0 && (
            <span className="bg-teal-50 text-teal-600 text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-lg">
              +{activity.progressToday}%
            </span>
          )}
        </div>

        {activity.fieldActivity?.enabled && (
          <div className="bg-teal-50 rounded-[10px] px-3 py-2.5 mb-2 flex gap-2.5">
            <Map size={16} className="text-teal-600 shrink-0 mt-0.5" />
            <div className="text-xs text-teal-800">
              <div className="font-bold">{activity.fieldActivity.interventionType}</div>
              {activity.fieldActivity.intravilanBuildings > 0 && (
                <div>{activity.fieldActivity.intravilanBuildings} imobile</div>
              )}
              {activity.fieldActivity.extravilanElements?.length > 0 && (
                <div>{activity.fieldActivity.extravilanElements.map(e => e.type).join(", ")}</div>
              )}
              <div className="flex gap-3 mt-1 opacity-80">
                {activity.fieldHours > 0 && (
                  <span className="flex items-center gap-1 font-mono"><Mountain size={11} /> {formatHours(activity.fieldHours)}</span>
                )}
                {activity.travelHours > 0 && (
                  <span className="flex items-center gap-1 font-mono"><Car size={11} /> {formatHours(activity.travelHours)}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {activity.officeActivity?.enabled && (
          <div className="bg-blue-50 rounded-[10px] px-3 py-2.5 mb-2 flex gap-2.5">
            <Monitor size={16} className="text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-700">
              <div className="font-bold">{activity.officeActivity.types?.join(", ") || "Birou"}</div>
              {activity.officeActivity.description && <div className="opacity-80">{activity.officeActivity.description}</div>}
              {activity.officeHours > 0 && (
                <div className="flex items-center gap-1 mt-1 font-mono"><Clock size={11} /> {formatHours(activity.officeHours)}</div>
              )}
            </div>
          </div>
        )}

        {activity.observations && (
          <div className="bg-amber-50 rounded-[10px] px-3 py-2 text-xs text-amber-900 italic">
            "{activity.observations}"
          </div>
        )}

        <div className="flex gap-2 mt-2.5 pt-2.5 border-t border-slate-50">
          <button onClick={copy}
            className={`flex gap-1.5 items-center text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer border-none font-sans transition-all duration-150 ${
              copied ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}>
            {copied ? <><Check size={12} /> Copiat!</> : <><MessageCircle size={12} /> WhatsApp</>}
          </button>
          <button onClick={() => setDel(true)} className="cad-icon-btn cad-icon-btn-danger ml-auto">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <ConfirmDialog isOpen={del} title="Șterge activitatea?" message="Această acțiune nu poate fi anulată."
        onConfirm={() => { deleteActivity(activity.id); setDel(false); }} onCancel={() => setDel(false)} />
    </>
  );
}
