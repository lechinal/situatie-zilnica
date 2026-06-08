import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { Modal, Field, Input, Select, Textarea, Btn } from "../ui/index.jsx";
import { STATUS_OPTIONS, INTERVENTION_TYPES, EXTRA_ELEMENTS, OFFICE_TYPES, QUICK_OBS } from "../../utils/constants.js";
import { calcNewProgress, calcBetween, formatHours } from "../../utils/format.js";

export default function ActivityForm({ isOpen, onClose, sector, locality, uat, finance }) {
  const { addActivity, colleagues } = useApp();
  const today = new Date().toISOString().split("T")[0];
  const [f, setF] = useState({
    date: today, team: [], observations: "", progressPrev: sector?.progress || 0, progressToday: 0, sectorStatus: sector?.status || "În lucru",
    fieldEnabled: false, interventionType: "Măsurători inițiale", intravilanBuildings: "", extravilanElements: [], timeMode: "manual",
    fieldHours: "", travelHours: "", departureTo: "", arrivalAt: "", fieldStart: "", fieldEnd: "", departureFrom: "", arrivalBack: "",
    officeEnabled: false, officeTypes: [], officeDescription: "", officetimeMode: "manual", officeHours: "", officeStart: "", officeEnd: "",
  });

  useEffect(() => {
    setF(p => ({ ...p, progressPrev: sector?.progress || 0, sectorStatus: sector?.status || "În lucru" }));
  }, [sector, isOpen]);

  useEffect(() => {
    if (f.timeMode === "auto") {
      const travel = calcBetween(f.departureTo, f.arrivalAt) + calcBetween(f.departureFrom, f.arrivalBack);
      const field  = calcBetween(f.fieldStart, f.fieldEnd);
      setF(p => ({ ...p, fieldHours: Math.round(field * 100) / 100 || "", travelHours: Math.round(travel * 100) / 100 || "" }));
    }
  }, [f.timeMode, f.departureTo, f.arrivalAt, f.fieldStart, f.fieldEnd, f.departureFrom, f.arrivalBack]);

  useEffect(() => {
    if (f.officetimeMode === "auto") {
      const h = calcBetween(f.officeStart, f.officeEnd);
      setF(p => ({ ...p, officeHours: Math.round(h * 100) / 100 || "" }));
    }
  }, [f.officetimeMode, f.officeStart, f.officeEnd]);

  const progressNew   = calcNewProgress(f.progressPrev, f.progressToday);
  const toggleTeam    = (n) => setF(p => ({ ...p, team: p.team.includes(n) ? p.team.filter(x => x !== n) : [...p.team, n] }));
  const toggleOffType = (t) => setF(p => ({ ...p, officeTypes: p.officeTypes.includes(t) ? p.officeTypes.filter(x => x !== t) : [...p.officeTypes, t] }));
  const addExtra      = (type) => setF(p => ({ ...p, extravilanElements: [...p.extravilanElements, { type, km: "" }] }));
  const removeExtra   = (i) => setF(p => ({ ...p, extravilanElements: p.extravilanElements.filter((_, j) => j !== i) }));

  const submit = () => {
    addActivity({
      sectorId: sector.id, date: f.date, team: f.team, observations: f.observations,
      progressPrev: parseFloat(f.progressPrev) || 0, progressToday: parseFloat(f.progressToday) || 0, progressNew,
      sectorStatus: f.sectorStatus, fieldHours: parseFloat(f.fieldHours) || 0, travelHours: parseFloat(f.travelHours) || 0, officeHours: parseFloat(f.officeHours) || 0,
      fieldActivity:  f.fieldEnabled  ? { enabled: true, interventionType: f.interventionType, intravilanBuildings: parseInt(f.intravilanBuildings) || 0, extravilanElements: f.extravilanElements } : { enabled: false },
      officeActivity: f.officeEnabled ? { enabled: true, types: f.officeTypes, description: f.officeDescription } : { enabled: false },
    });
    onClose();
  };

  const secStyle = { border: "1.5px solid #f1f5f9", borderRadius: 14, overflow: "hidden", marginBottom: 14 };
  const secHead  = { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#334155", fontFamily: "inherit" };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Activitate nouă"
      subtitle={`${finance?.name} · ${uat?.name} · ${locality?.name} · Sector ${sector?.sectorNumber}`}
      maxWidth={600}
      footer={<><Btn variant="secondary" onClick={onClose}>Anulează</Btn><Btn onClick={submit} style={{ flex: 1, justifyContent: "center" }}>💾 Salvează activitatea</Btn></>}>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 4 }}>
        <Field label="Data"><Input type="date" value={f.date} onChange={e => setF(p => ({ ...p, date: e.target.value }))} /></Field>
        <Field label="Status sector">
          <Select value={f.sectorStatus} onChange={e => setF(p => ({ ...p, sectorStatus: e.target.value }))}>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </Select>
        </Field>
      </div>

      <Field label="Echipă">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {colleagues.map(c => (
            <button key={c.id} type="button" onClick={() => toggleTeam(c.name)}
              style={{ padding: "6px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", transition: "all .15s", background: f.team.includes(c.name) ? "#0d9488" : "#f1f5f9", color: f.team.includes(c.name) ? "#fff" : "#334155", fontFamily: "inherit" }}>
              {f.team.includes(c.name) ? "✓ " : ""}{c.name}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Progres sector">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, alignItems: "center" }}>
          <div><label style={{ fontSize: 10, color: "#94a3b8", display: "block", marginBottom: 3 }}>Anterior (%)</label><Input type="number" min="0" max="100" value={f.progressPrev} onChange={e => setF(p => ({ ...p, progressPrev: e.target.value }))} /></div>
          <div><label style={{ fontSize: 10, color: "#94a3b8", display: "block", marginBottom: 3 }}>Realizat azi (%)</label><Input type="number" min="0" max="100" value={f.progressToday} onChange={e => setF(p => ({ ...p, progressToday: e.target.value }))} /></div>
          <div style={{ textAlign: "center", background: "#f0fdfa", borderRadius: 12, padding: "8px 14px", minWidth: 64 }}>
            <div style={{ fontSize: 9, color: "#0d9488", fontWeight: 700, textTransform: "uppercase" }}>Nou</div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 24, color: "#0d9488", letterSpacing: "-0.5px" }}>{progressNew}%</div>
          </div>
        </div>
      </Field>

      {/* TEREN */}
      <div style={secStyle}>
        <button type="button" style={secHead} onClick={() => setF(p => ({ ...p, fieldEnabled: !p.fieldEnabled }))}>
          <span>🗺️ Activitate teren {f.fieldEnabled && <span style={{ fontSize: 9, background: "#ccfbf1", color: "#0d9488", padding: "1px 8px", borderRadius: 20, marginLeft: 6 }}>ACTIV</span>}</span>
          <span style={{ color: "#94a3b8" }}>{f.fieldEnabled ? "▲" : "▼"}</span>
        </button>
        {f.fieldEnabled && (
          <div style={{ padding: "0 14px 14px", borderTop: "1px solid #f1f5f9" }}>
            <Field label="Tip intervenție" style={{ marginTop: 12 }}>
              <div style={{ display: "flex", gap: 8 }}>
                {INTERVENTION_TYPES.map(t => (
                  <button key={t} type="button" onClick={() => setF(p => ({ ...p, interventionType: t }))}
                    style={{ flex: 1, padding: "8px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", background: f.interventionType === t ? "#0d9488" : "#f1f5f9", color: f.interventionType === t ? "#fff" : "#334155", fontFamily: "inherit" }}>
                    {t}
                  </button>
                ))}
              </div>
            </Field>
            {(sector?.zoneType === "Intravilan" || sector?.zoneType === "Mixt") && (
              <Field label="Imobile măsurate"><Input type="number" min="0" value={f.intravilanBuildings} onChange={e => setF(p => ({ ...p, intravilanBuildings: e.target.value }))} placeholder="0" /></Field>
            )}
            {(sector?.zoneType === "Extravilan" || sector?.zoneType === "Mixt") && (
              <Field label="Elemente extravilan">
                {f.extravilanElements.map((el, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    <span style={{ flex: 1, fontSize: 12, background: "#f8fafc", padding: "7px 10px", borderRadius: 8, color: "#334155" }}>{el.type}</span>
                    <Input type="number" min="0" step="0.1" value={el.km} onChange={e => { const c = [...f.extravilanElements]; c[i] = { ...c[i], km: e.target.value }; setF(p => ({ ...p, extravilanElements: c })); }} placeholder="km" style={{ width: 80 }} />
                    <button type="button" onClick={() => removeExtra(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", padding: 4 }}>✕</button>
                  </div>
                ))}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                  {EXTRA_ELEMENTS.map(el => (
                    <button key={el} type="button" onClick={() => addExtra(el)}
                      style={{ fontSize: 11, background: "#f1f5f9", border: "none", borderRadius: 8, padding: "4px 10px", cursor: "pointer", color: "#475569", fontFamily: "inherit" }}>+ {el}</button>
                  ))}
                </div>
              </Field>
            )}
            <div style={{ borderTop: "1px dashed #f1f5f9", paddingTop: 12, marginTop: 4 }}>
              <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#64748b", marginBottom: 8, display: "block" }}>Timp teren</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                {["manual", "auto"].map(m => (
                  <button key={m} type="button" onClick={() => setF(p => ({ ...p, timeMode: m }))}
                    style={{ flex: 1, padding: "7px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", background: f.timeMode === m ? "#1e293b" : "#f1f5f9", color: f.timeMode === m ? "#fff" : "#334155", fontFamily: "inherit" }}>
                    {m === "manual" ? "✏️ Manual" : "🕐 Automat"}
                  </button>
                ))}
              </div>
              {f.timeMode === "manual" ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <Field label="Ore teren"><Input type="number" min="0" step="0.5" value={f.fieldHours} onChange={e => setF(p => ({ ...p, fieldHours: e.target.value }))} placeholder="0" /></Field>
                  <Field label="Ore deplasare"><Input type="number" min="0" step="0.5" value={f.travelHours} onChange={e => setF(p => ({ ...p, travelHours: e.target.value }))} placeholder="0" /></Field>
                </div>
              ) : (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <Field label="Plecare (dus)"><Input type="time" value={f.departureTo} onChange={e => setF(p => ({ ...p, departureTo: e.target.value }))} /></Field>
                    <Field label="Sosire destinație"><Input type="time" value={f.arrivalAt} onChange={e => setF(p => ({ ...p, arrivalAt: e.target.value }))} /></Field>
                    <Field label="Început măsurători"><Input type="time" value={f.fieldStart} onChange={e => setF(p => ({ ...p, fieldStart: e.target.value }))} /></Field>
                    <Field label="Sfârșit măsurători"><Input type="time" value={f.fieldEnd} onChange={e => setF(p => ({ ...p, fieldEnd: e.target.value }))} /></Field>
                    <Field label="Plecare (retur)"><Input type="time" value={f.departureFrom} onChange={e => setF(p => ({ ...p, departureFrom: e.target.value }))} /></Field>
                    <Field label="Sosire acasă"><Input type="time" value={f.arrivalBack} onChange={e => setF(p => ({ ...p, arrivalBack: e.target.value }))} /></Field>
                  </div>
                  {(f.fieldHours > 0 || f.travelHours > 0) && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                      <div style={{ background: "#f0fdfa", borderRadius: 10, padding: "8px 12px", textAlign: "center" }}>
                        <div style={{ fontSize: 9, color: "#0d9488", fontWeight: 700 }}>TEREN</div>
                        <div style={{ fontFamily: "monospace", fontWeight: 700, color: "#0d9488", fontSize: 16 }}>{formatHours(parseFloat(f.fieldHours) || 0)}</div>
                      </div>
                      <div style={{ background: "#eff6ff", borderRadius: 10, padding: "8px 12px", textAlign: "center" }}>
                        <div style={{ fontSize: 9, color: "#2563eb", fontWeight: 700 }}>DEPLASARE</div>
                        <div style={{ fontFamily: "monospace", fontWeight: 700, color: "#2563eb", fontSize: 16 }}>{formatHours(parseFloat(f.travelHours) || 0)}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* BIROU */}
      <div style={secStyle}>
        <button type="button" style={secHead} onClick={() => setF(p => ({ ...p, officeEnabled: !p.officeEnabled }))}>
          <span>🖥️ Activitate birou {f.officeEnabled && <span style={{ fontSize: 9, background: "#dbeafe", color: "#2563eb", padding: "1px 8px", borderRadius: 20, marginLeft: 6 }}>ACTIV</span>}</span>
          <span style={{ color: "#94a3b8" }}>{f.officeEnabled ? "▲" : "▼"}</span>
        </button>
        {f.officeEnabled && (
          <div style={{ padding: "0 14px 14px", borderTop: "1px solid #f1f5f9" }}>
            <Field label="Tip activitate" style={{ marginTop: 12 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {OFFICE_TYPES.map(t => (
                  <button key={t} type="button" onClick={() => toggleOffType(t)}
                    style={{ padding: "6px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", background: f.officeTypes.includes(t) ? "#2563eb" : "#f1f5f9", color: f.officeTypes.includes(t) ? "#fff" : "#334155", fontFamily: "inherit", transition: "all .15s" }}>
                    {t}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Descriere">
              <Textarea value={f.officeDescription} onChange={e => setF(p => ({ ...p, officeDescription: e.target.value }))} placeholder="Detalii..." style={{ minHeight: 56 }} />
            </Field>
            <div style={{ borderTop: "1px dashed #f1f5f9", paddingTop: 12 }}>
              <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: 8, display: "block" }}>Timp birou</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                {["manual", "auto"].map(m => (
                  <button key={m} type="button" onClick={() => setF(p => ({ ...p, officetimeMode: m }))}
                    style={{ flex: 1, padding: "7px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", background: f.officetimeMode === m ? "#1e293b" : "#f1f5f9", color: f.officetimeMode === m ? "#fff" : "#334155", fontFamily: "inherit" }}>
                    {m === "manual" ? "✏️ Manual" : "🕐 Automat"}
                  </button>
                ))}
              </div>
              {f.officetimeMode === "manual"
                ? <Field label="Ore birou"><Input type="number" min="0" step="0.5" value={f.officeHours} onChange={e => setF(p => ({ ...p, officeHours: e.target.value }))} placeholder="0" /></Field>
                : <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <Field label="Ora început"><Input type="time" value={f.officeStart} onChange={e => setF(p => ({ ...p, officeStart: e.target.value }))} /></Field>
                    <Field label="Ora sfârșit"><Input type="time" value={f.officeEnd} onChange={e => setF(p => ({ ...p, officeEnd: e.target.value }))} /></Field>
                  </div>
              }
            </div>
          </div>
        )}
      </div>

      <Field label="Observații">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {QUICK_OBS.map(obs => (
            <button key={obs} type="button" onClick={() => setF(p => ({ ...p, observations: p.observations ? p.observations + ". " + obs : obs }))}
              style={{ fontSize: 11, background: "#f1f5f9", border: "none", borderRadius: 20, padding: "4px 10px", cursor: "pointer", color: "#475569", fontFamily: "inherit" }}>⚡ {obs}</button>
          ))}
        </div>
        <Textarea value={f.observations} onChange={e => setF(p => ({ ...p, observations: e.target.value }))} placeholder="Observații..." />
      </Field>
    </Modal>
  );
}
