import { useState, useRef } from "react";
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
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 24px" }}>
      <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 30, color: "#1e293b", marginBottom: 6, letterSpacing: "-0.5px" }}>Setări</h1>
      <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>Administrare colegi și backup date</p>

      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", padding: 20, marginBottom: 16 }}>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 17, color: "#334155", marginBottom: 16, marginTop: 0 }}>👥 Colegi</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {colleagues.map(c => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", borderRadius: 12, padding: "10px 14px" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 30, height: 30, borderRadius: 10, background: "#0d9488", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{c.name.charAt(0).toUpperCase()}</div>
                <span style={{ fontWeight: 600, color: "#334155", fontSize: 14 }}>{c.name}</span>
              </div>
              <button onClick={() => setDelTarget(c)} style={{ background: "none", border: "none", cursor: "pointer", color: "#cbd5e1", fontSize: 16 }}>✕</button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <Input value={name} onChange={e => { setName(e.target.value); setNameErr(""); }} onKeyDown={e => e.key === "Enter" && handleAdd()} placeholder="Nume coleg nou..." error={nameErr} />
            {nameErr && <div style={{ fontSize: 11, color: "#dc2626", marginTop: 3 }}>{nameErr}</div>}
          </div>
          <Btn onClick={handleAdd}>+ Adaugă</Btn>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", padding: 20 }}>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 17, color: "#334155", marginBottom: 16, marginTop: 0 }}>💾 Backup & Restaurare</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Export date", desc: "Descarcă toate datele ca JSON", btn: <Btn onClick={exportData}>⬇ Export JSON</Btn> },
            { label: "Import date", desc: "⚠️ Datele existente vor fi înlocuite", btn: <Btn variant="secondary" onClick={() => fileRef.current?.click()}>⬆ Import JSON</Btn> },
          ].map(({ label, desc, btn }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", borderRadius: 12, padding: "12px 16px" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#334155" }}>{label}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{desc}</div>
              </div>
              {btn}
            </div>
          ))}
          {importStatus && (
            <div style={{ background: importStatus === "success" ? "#d1fae5" : "#fee2e2", color: importStatus === "success" ? "#065f46" : "#991b1b", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 600 }}>
              {importStatus === "success" ? "✓ Date importate cu succes!" : "✗ Eroare la importul fișierului."}
            </div>
          )}
          <input ref={fileRef} type="file" accept=".json" style={{ display: "none" }} onChange={handleImport} />
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#cbd5e1" }}>
        Cadastru Sistematic · Situație Zilnică v2.0<br />Datele sunt salvate local în browser.
      </div>

      <ConfirmDialog isOpen={!!delTarget} title="Șterge colegul?" message={`Vei șterge "${delTarget?.name}".`}
        onConfirm={() => { deleteColleague(delTarget.id); setDelTarget(null); }} onCancel={() => setDelTarget(null)} />
    </div>
  );
}
