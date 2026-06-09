import { useState, useRef } from "react";
import { Users, HardDrive, Download, Upload, X, Plus, Check, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { Btn, Input, ConfirmDialog } from "../components/ui/index.jsx";

export default function SettingsPage() {
  const { colleagues, addColleague, deleteColleague, exportData, importData } = useApp();
  const [name,         setName]         = useState("");
  const [nameErr,      setNameErr]      = useState("");
  const [delTarget,    setDelTarget]    = useState(null);
  const [importStatus, setImportStatus] = useState(null);
  const fileRef = useRef();

  const handleAdd = () => {
    if (!name.trim()) { setNameErr("Introdu un nume"); return; }
    if (colleagues.some(c => c.name.toLowerCase() === name.trim().toLowerCase())) { setNameErr("Colegul există deja"); return; }
    addColleague(name.trim()); setName(""); setNameErr("");
  };

  const handleImport = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { const ok = importData(ev.target.result); setImportStatus(ok ? "success" : "error"); setTimeout(() => setImportStatus(null), 3000); };
    reader.readAsText(file); e.target.value = "";
  };

  return (
    <div className="max-w-[720px] mx-auto px-6 py-7">
      <h1 className="font-display font-bold text-[30px] text-slate-800 mb-1.5 tracking-[-0.5px]">Setări</h1>
      <p className="text-[13px] text-slate-400 mb-6">Administrare colegi și backup date</p>

      {/* Colegi */}
      <div className="cad-card p-5 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-[34px] h-[34px] rounded-[10px] bg-teal-50 flex items-center justify-center">
            <Users size={17} color="#0d9488" />
          </div>
          <h2 className="font-display font-semibold text-[17px] text-slate-700 m-0">Colegi</h2>
        </div>

        <div className="flex flex-col gap-2 mb-3.5">
          {colleagues.map(c => (
            <div key={c.id} className="flex justify-between items-center bg-slate-50 rounded-xl px-3.5 py-2.5">
              <div className="flex gap-2.5 items-center">
                <div className="w-[30px] h-[30px] rounded-[10px] bg-teal-600 text-white flex items-center justify-center text-[13px] font-bold">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-slate-700 text-sm">{c.name}</span>
              </div>
              <button onClick={() => setDelTarget(c)} className="cad-icon-btn cad-icon-btn-danger">
                <X size={15} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Input value={name} onChange={e => { setName(e.target.value); setNameErr(""); }}
              onKeyDown={e => e.key === "Enter" && handleAdd()} placeholder="Nume coleg nou..." error={nameErr} />
            {nameErr && <div className="text-[11px] text-red-600 mt-0.5">{nameErr}</div>}
          </div>
          <Btn onClick={handleAdd}><Plus size={15} /> Adaugă</Btn>
        </div>
      </div>

      {/* Backup */}
      <div className="cad-card p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-[34px] h-[34px] rounded-[10px] bg-blue-50 flex items-center justify-center">
            <HardDrive size={17} color="#2563eb" />
          </div>
          <h2 className="font-display font-semibold text-[17px] text-slate-700 m-0">Backup & Restaurare</h2>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-3">
            <div>
              <div className="font-bold text-[13px] text-slate-700">Export date</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Descarcă toate datele ca JSON</div>
            </div>
            <Btn onClick={exportData}><Download size={14} /> Export JSON</Btn>
          </div>
          <div className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-3">
            <div>
              <div className="font-bold text-[13px] text-slate-700">Import date</div>
              <div className="text-[11px] text-slate-400 mt-0.5">⚠️ Datele existente vor fi înlocuite</div>
            </div>
            <Btn variant="secondary" onClick={() => fileRef.current?.click()}><Upload size={14} /> Import JSON</Btn>
          </div>
          {importStatus && (
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-semibold ${
              importStatus === "success" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
            }`}>
              {importStatus === "success"
                ? <><Check size={15} /> Date importate cu succes!</>
                : <><AlertCircle size={15} /> Eroare la importul fișierului.</>}
            </div>
          )}
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </div>
      </div>

      <div className="text-center mt-6 text-[11px] text-slate-300">
        Cadastru Sistematic · Situație Zilnică v2.0<br />Datele sunt salvate local în browser.
      </div>

      <ConfirmDialog isOpen={!!delTarget} title="Șterge colegul?" message={`Vei șterge "${delTarget?.name}".`}
        onConfirm={() => { deleteColleague(delTarget.id); setDelTarget(null); }} onCancel={() => setDelTarget(null)} />
    </div>
  );
}
