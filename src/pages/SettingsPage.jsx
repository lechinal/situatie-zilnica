import { useState, useRef } from "react";
import SignatureAEA from "../components/SignatureAEA.jsx";
import { Users, HardDrive, Download, Upload, X, Plus, Check, AlertCircle, UserCircle2, ClipboardList, KeyRound } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { Btn, Input, ConfirmDialog } from "../components/ui/index.jsx";

const ACTION_STYLES = {
  CREATE: { bg: "bg-teal-100",  text: "text-teal-700",  label: "Adăugat" },
  UPDATE: { bg: "bg-amber-100", text: "text-amber-700", label: "Modificat" },
  DELETE: { bg: "bg-red-100",   text: "text-red-700",   label: "Șters" },
  IMPORT: { bg: "bg-blue-100",  text: "text-blue-700",  label: "Import" },
};

const fmtDateTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("ro-RO", { day: "2-digit", month: "short" }) + ", " +
         d.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
};

export default function SettingsPage() {
  const {
    colleagues, addColleague, deleteColleague, setColleaguePin,
    exportData, importData,
    currentUser, currentUserRole, logout,
    auditLogs,
  } = useApp();

  const isAdmin = currentUserRole === "admin";

  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [delTarget, setDelTarget] = useState(null);
  const [importStatus, setImportStatus] = useState(null);
  const [showAllLogs, setShowAllLogs] = useState(false);
  const fileRef = useRef();

  // PIN editing state
  const [pinEditId, setPinEditId] = useState(null);
  const [pinInput, setPinInput] = useState("");
  const [pinConfirmInput, setPinConfirmInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinBusy, setPinBusy] = useState(false);

  const handleAdd = () => {
    if (!name.trim()) { setNameErr("Introdu un nume"); return; }
    if (colleagues.some(c => c.name.toLowerCase() === name.trim().toLowerCase())) { setNameErr("Colegul există deja"); return; }
    addColleague(name.trim());
    setName("");
    setNameErr("");
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ok = importData(ev.target.result);
      setImportStatus(ok ? "success" : "error");
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const openPinEdit = (id) => {
    setPinEditId(id);
    setPinInput("");
    setPinConfirmInput("");
    setPinError("");
  };

  const handleSavePin = async (id) => {
    if (pinInput.length < 4) { setPinError("Minim 4 caractere"); return; }
    if (pinInput !== pinConfirmInput) { setPinError("PIN-urile nu coincid"); return; }
    setPinBusy(true);
    await setColleaguePin(id, pinInput);
    setPinBusy(false);
    setPinEditId(null);
  };

  const visibleLogs = showAllLogs ? auditLogs : auditLogs.slice(0, 20);

  return (
    <div className="max-w-[720px] mx-auto px-6 py-7">
      <h1 className="font-display font-bold text-[30px] text-slate-800 mb-1.5 tracking-[-0.5px]">Setări</h1>
      <p className="text-[13px] text-slate-400 mb-6">
        {isAdmin ? "Administrare colegi, PIN-uri, jurnal activitate și backup" : "Backup date"}
      </p>

      {/* Utilizator curent */}
      <div className="cad-card p-5 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-[34px] h-[34px] rounded-[10px] bg-purple-50 flex items-center justify-center">
            <UserCircle2 size={17} color="#9333ea" />
          </div>
          <h2 className="font-display font-semibold text-[17px] text-slate-700 m-0">Cont activ</h2>
        </div>
        <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center text-[14px] font-bold">
              {currentUser ? currentUser.charAt(0).toUpperCase() : "?"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700 text-sm">{currentUser || "Neidentificat"}</span>
                {isAdmin && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700">Admin</span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Activitățile sunt înregistrate cu acest cont</div>
            </div>
          </div>
          <Btn variant="danger" onClick={logout}>Deconectare</Btn>
        </div>
      </div>

      {/* Jurnal activitate — admin only */}
      {isAdmin && (
        <div className="cad-card p-5 mb-4">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-amber-50 flex items-center justify-center">
              <ClipboardList size={17} color="#d97706" />
            </div>
            <h2 className="font-display font-semibold text-[17px] text-slate-700 m-0">Jurnal activitate</h2>
          </div>
          {auditLogs.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">Nicio activitate înregistrată încă.</p>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                {visibleLogs.map(log => {
                  const s = ACTION_STYLES[log.action] || ACTION_STYLES.UPDATE;
                  return (
                    <div key={log.id} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                        {log.author.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] text-slate-700">{log.description}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${s.bg} ${s.text}`}>{s.label}</span>
                          <span className="text-[11px] text-slate-400">{log.author} · {fmtDateTime(log.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {auditLogs.length > 20 && (
                <button onClick={() => setShowAllLogs(p => !p)}
                  className="w-full mt-3 py-2 text-[12px] font-semibold text-slate-500 hover:text-slate-700 bg-transparent border-none cursor-pointer font-sans transition-colors">
                  {showAllLogs ? "Arată mai puțin" : `Vezi toate (${auditLogs.length})`}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Colegi — admin only */}
      {isAdmin && (
        <div className="cad-card p-5 mb-4">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-teal-50 flex items-center justify-center">
              <Users size={17} color="#0d9488" />
            </div>
            <h2 className="font-display font-semibold text-[17px] text-slate-700 m-0">Colegi & PIN-uri</h2>
          </div>
          <div className="flex flex-col gap-2 mb-3.5">
            {colleagues.map(c => (
              <div key={c.id} className="flex flex-col gap-2 bg-slate-50 rounded-xl px-3.5 py-2.5">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2.5 items-center">
                    <div className="w-[30px] h-[30px] rounded-[10px] bg-teal-600 text-white flex items-center justify-center text-[13px] font-bold">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700 text-sm">{c.name}</span>
                        {c.role === "admin" && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700">Admin</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <KeyRound size={10} />
                        {c.pin ? "PIN setat" : "PIN nesetat"}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => pinEditId === c.id ? setPinEditId(null) : openPinEdit(c.id)}
                      className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border-none cursor-pointer font-sans transition-colors ${pinEditId === c.id ? "bg-slate-200 text-slate-600" : "bg-amber-100 text-amber-700 hover:bg-amber-200"}`}>
                      {pinEditId === c.id ? "Anulează" : (c.pin ? "Resetează PIN" : "Setează PIN")}
                    </button>
                    {c.name !== currentUser && (
                      <button onClick={() => setDelTarget(c)} className="cad-icon-btn cad-icon-btn-danger"><X size={15} /></button>
                    )}
                  </div>
                </div>
                {pinEditId === c.id && (
                  <div className="flex flex-col gap-2 pt-1">
                    <div className="flex gap-2">
                      <input type="password" value={pinInput}
                        onChange={e => { setPinInput(e.target.value); setPinError(""); }}
                        placeholder="PIN nou (min. 4)"
                        autoFocus
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-[13px] outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all font-sans" />
                      <input type="password" value={pinConfirmInput}
                        onChange={e => { setPinConfirmInput(e.target.value); setPinError(""); }}
                        placeholder="Confirmă"
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-[13px] outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all font-sans" />
                    </div>
                    {pinError && <div className="text-[11px] text-red-600 font-semibold">{pinError}</div>}
                    <button onClick={() => handleSavePin(c.id)} disabled={pinBusy}
                      className="self-start px-4 py-1.5 rounded-xl bg-amber-500 text-white text-[12px] font-bold border-none cursor-pointer hover:bg-amber-600 transition-colors font-sans disabled:opacity-50">
                      {pinBusy ? "Se salvează..." : "Salvează PIN"}
                    </button>
                  </div>
                )}
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
      )}

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
          {isAdmin && (
            <div className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-3">
              <div>
                <div className="font-bold text-[13px] text-slate-700">Import date</div>
                <div className="text-[11px] text-slate-400 mt-0.5">⚠️ Datele existente vor fi înlocuite</div>
              </div>
              <Btn variant="secondary" onClick={() => fileRef.current?.click()}><Upload size={14} /> Import JSON</Btn>
            </div>
          )}
          {importStatus && (
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-semibold ${importStatus === "success" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
              {importStatus === "success" ? <><Check size={15} /> Date importate cu succes!</> : <><AlertCircle size={15} /> Eroare la importul fișierului.</>}
            </div>
          )}
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </div>
      </div>

      <div className="text-center mt-6 text-[11px] text-slate-300 mb-2">
        Cadastru Sistematic · Situație Zilnică v1.0<br />
        Datele sunt salvate în Supabase.
      </div>
      <div className="max-w-xs mx-auto">
        <SignatureAEA />
      </div>

      <ConfirmDialog isOpen={!!delTarget} title="Șterge colegul?" message={`Vei șterge "${delTarget?.name}".`}
        onConfirm={() => { deleteColleague(delTarget.id); setDelTarget(null); }}
        onCancel={() => setDelTarget(null)} />
    </div>
  );
}
