import { useState, useEffect } from "react";
import { Map, Monitor, Pencil, Clock, Plus, X, Zap, Save } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { Modal, Field, Input, Select, Textarea, Btn, DateInput } from "../ui/index.jsx";
import { STATUS_OPTIONS, INTERVENTION_TYPES, EXTRA_ELEMENTS, OFFICE_TYPES, QUICK_OBS } from "../../utils/constants.js";
import { calcNewProgress, calcBetween, formatHours } from "../../utils/format.js";

export default function ActivityForm({ isOpen, onClose, sector, locality, uat, finance, editActivity }) {
  const { addActivity, updateActivity, colleagues } = useApp();
  const today = new Date().toISOString().split("T")[0];
  const [f, setF] = useState({
    date: today, team: [], observations: "", progressPrev: sector?.progress || 0, progressToday: 0, sectorStatus: sector?.status || "În lucru",
    fieldEnabled: false, interventionType: "Măsurători inițiale", intravilanBuildings: "", extravilanElements: [], timeMode: "manual",
    fieldHours: "", travelHours: "", departureTo: "", arrivalAt: "", fieldStart: "", fieldEnd: "", departureFrom: "", arrivalBack: "",
    officeEnabled: false, officeTypes: [], officeDescription: "", officetimeMode: "manual", officeHours: "", officeStart: "", officeEnd: "",
  });

  useEffect(() => {
    if (!isOpen) return;
    if (editActivity) {
      // Pre-completăm formularul cu datele activității existente
      setF({
        date:              editActivity.date || today,
        team:              editActivity.team || [],
        observations:      editActivity.observations || "",
        progressPrev:      editActivity.progressPrev ?? 0,
        progressToday:     editActivity.progressToday ?? 0,
        sectorStatus:      editActivity.sectorStatus || sector?.status || "În lucru",
        fieldEnabled:      editActivity.fieldActivity?.enabled || false,
        interventionType:  editActivity.fieldActivity?.interventionType || "Măsurători inițiale",
        intravilanBuildings: editActivity.fieldActivity?.intravilanBuildings || "",
        extravilanElements: editActivity.fieldActivity?.extravilanElements || [],
        timeMode:          "manual",
        fieldHours:        editActivity.fieldHours || "",
        travelHours:       editActivity.travelHours || "",
        departureTo: "", arrivalAt: "", fieldStart: "", fieldEnd: "", departureFrom: "", arrivalBack: "",
        officeEnabled:     editActivity.officeActivity?.enabled || false,
        officeTypes:       editActivity.officeActivity?.types || [],
        officeDescription: editActivity.officeActivity?.description || "",
        officetimeMode:    "manual",
        officeHours:       editActivity.officeHours || "",
        officeStart: "", officeEnd: "",
      });
    } else {
      setF(p => ({ ...p, progressPrev: sector?.progress || 0, sectorStatus: sector?.status || "În lucru" }));
    }
  }, [editActivity, sector, isOpen]);

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

  const payload = {
    sectorId: sector.id, date: f.date, team: f.team, observations: f.observations,
    progressPrev: parseFloat(f.progressPrev) || 0, progressToday: parseFloat(f.progressToday) || 0, progressNew,
    sectorStatus: f.sectorStatus, fieldHours: parseFloat(f.fieldHours) || 0, travelHours: parseFloat(f.travelHours) || 0, officeHours: parseFloat(f.officeHours) || 0,
    fieldActivity:  f.fieldEnabled  ? { enabled: true, interventionType: f.interventionType, intravilanBuildings: parseInt(f.intravilanBuildings) || 0, extravilanElements: f.extravilanElements } : { enabled: false },
    officeActivity: f.officeEnabled ? { enabled: true, types: f.officeTypes, description: f.officeDescription } : { enabled: false },
  };

  const submit = () => {
    if (editActivity) {
      updateActivity(editActivity.id, payload);
    } else {
      addActivity(payload);
    }
    onClose();
  };

  const sectionCls = "border border-slate-100 rounded-[14px] overflow-hidden mb-3.5";
  const sectionHeadCls = "w-full flex items-center justify-between px-3.5 py-3 bg-transparent border-none cursor-pointer text-[13px] font-bold text-slate-700 font-sans hover:bg-slate-50 transition-colors duration-100";
  const modeBtnCls = (active) => `flex-1 flex items-center justify-center gap-1.5 py-[7px] rounded-[10px] text-xs font-semibold cursor-pointer border-none font-sans transition-all duration-150 ${active ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose}
      title={editActivity ? "Editează activitatea" : "Activitate nouă"}
      subtitle={`${finance?.name} · ${uat?.name} · ${locality?.name} · Sector ${sector?.sectorNumber}`}
      maxWidth={600}
      footer={<><Btn variant="secondary" onClick={onClose}>Anulează</Btn><Btn onClick={submit} style={{ flex: 1, justifyContent: "center" }}><Save size={14} /> {editActivity ? "Salvează modificările" : "Salvează activitatea"}</Btn></>}>

      <div className="grid grid-cols-2 gap-2.5 mb-1">
        <Field label="Data"><DateInput value={f.date} onChange={v => setF(p => ({ ...p, date: v }))} /></Field>
        <Field label="Status sector">
          <Select value={f.sectorStatus} onChange={e => setF(p => ({ ...p, sectorStatus: e.target.value }))}>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </Select>
        </Field>
      </div>

      <Field label="Echipă">
        <div className="flex gap-2 flex-wrap">
          {colleagues.map(c => (
            <button key={c.id} type="button" onClick={() => toggleTeam(c.name)}
              className={`px-3.5 py-1.5 rounded-[10px] text-[13px] font-semibold cursor-pointer border-none transition-all duration-150 font-sans ${
                f.team.includes(c.name) ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}>
              {f.team.includes(c.name) ? "✓ " : ""}{c.name}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Progres sector">
        <div className="grid gap-2.5 items-center grid-cols-[1fr_1fr_auto] " >
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Anterior (%)</label>
            <Input type="number" min="0" max="100" value={f.progressPrev} onChange={e => setF(p => ({ ...p, progressPrev: e.target.value }))} />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Realizat azi (%)</label>
            <Input type="number" min="0" max="100" value={f.progressToday} onChange={e => setF(p => ({ ...p, progressToday: e.target.value }))} />
          </div>
          <div className="text-center bg-teal-50 rounded-xl px-3.5 py-2 min-w-[64px]">
            <div className="text-[9px] text-teal-600 font-bold uppercase">Nou</div>
            <div className="font-display font-bold text-teal-600 leading-none text-[24px] tracking-[-0.5px]">{progressNew}%</div>
          </div>
        </div>
      </Field>

      {/* TEREN */}
      <div className={sectionCls}>
        <button type="button" className={sectionHeadCls} onClick={() => setF(p => ({ ...p, fieldEnabled: !p.fieldEnabled }))}>
          <span className="flex items-center gap-2">
            <Map size={15} /> Activitate teren
            {f.fieldEnabled && <span className="text-[9px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-bold">ACTIV</span>}
          </span>
          <span className="text-slate-400 text-[10px]">{f.fieldEnabled ? "▲" : "▼"}</span>
        </button>
        {f.fieldEnabled && (
          <div className="px-3.5 pb-3.5 border-t border-slate-100">
            <Field label="Tip intervenție">
              <div className="flex gap-2 mt-3">
                {INTERVENTION_TYPES.map(t => (
                  <button key={t} type="button" onClick={() => setF(p => ({ ...p, interventionType: t }))}
                    className={`flex-1 py-2 rounded-[10px] text-xs font-semibold cursor-pointer border-none font-sans transition-all duration-150 ${
                      f.interventionType === t ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </Field>
            {(sector?.zoneType === "Intravilan" || sector?.zoneType === "Mixt") && (
              <Field label="Imobile măsurate">
                <Input type="number" min="0" value={f.intravilanBuildings} onChange={e => setF(p => ({ ...p, intravilanBuildings: e.target.value }))} placeholder="0" />
              </Field>
            )}
            {(sector?.zoneType === "Extravilan" || sector?.zoneType === "Mixt") && (
              <Field label="Elemente extravilan">
                {f.extravilanElements.map((el, i) => (
                  <div key={i} className="flex gap-2 items-center mb-1.5">
                    <span className="flex-1 text-xs bg-slate-50 px-2.5 py-[7px] rounded-lg text-slate-700">{el.type}</span>
                    <Input type="number" min="0" step="0.1" value={el.km}
                      onChange={e => { const c = [...f.extravilanElements]; c[i] = { ...c[i], km: e.target.value }; setF(p => ({ ...p, extravilanElements: c })); }}
                      placeholder="km" style={{ width: 80 }} />
                    <button type="button" onClick={() => removeExtra(i)} className="cad-icon-btn cad-icon-btn-danger"><X size={14} /></button>
                  </div>
                ))}
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {EXTRA_ELEMENTS.map(el => (
                    <button key={el} type="button" onClick={() => addExtra(el)}
                      className="inline-flex items-center gap-1 text-[11px] bg-slate-100 border-none rounded-lg px-2.5 py-1 cursor-pointer text-slate-600 font-sans hover:bg-slate-200 transition-colors duration-100">
                      <Plus size={11} />{el}
                    </button>
                  ))}
                </div>
              </Field>
            )}
            <div className="border-t border-dashed border-slate-100 pt-3 mt-1">
              <label className="cad-label mb-2">Timp teren</label>
              <div className="flex gap-2 mb-2.5">
                {["manual", "auto"].map(m => (
                  <button key={m} type="button" onClick={() => setF(p => ({ ...p, timeMode: m }))} className={modeBtnCls(f.timeMode === m)}>
                    {m === "manual" ? <><Pencil size={12} /> Manual</> : <><Clock size={12} /> Automat</>}
                  </button>
                ))}
              </div>
              {f.timeMode === "manual" ? (
                <div className="grid grid-cols-2 gap-2.5">
                  <Field label="Ore teren"><Input type="number" min="0" step="0.5" value={f.fieldHours} onChange={e => setF(p => ({ ...p, fieldHours: e.target.value }))} placeholder="0" /></Field>
                  <Field label="Ore deplasare"><Input type="number" min="0" step="0.5" value={f.travelHours} onChange={e => setF(p => ({ ...p, travelHours: e.target.value }))} placeholder="0" /></Field>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Field label="Plecare (dus)"><Input type="time" value={f.departureTo} onChange={e => setF(p => ({ ...p, departureTo: e.target.value }))} /></Field>
                    <Field label="Sosire destinație"><Input type="time" value={f.arrivalAt} onChange={e => setF(p => ({ ...p, arrivalAt: e.target.value }))} /></Field>
                    <Field label="Început măsurători"><Input type="time" value={f.fieldStart} onChange={e => setF(p => ({ ...p, fieldStart: e.target.value }))} /></Field>
                    <Field label="Sfârșit măsurători"><Input type="time" value={f.fieldEnd} onChange={e => setF(p => ({ ...p, fieldEnd: e.target.value }))} /></Field>
                    <Field label="Plecare (retur)"><Input type="time" value={f.departureFrom} onChange={e => setF(p => ({ ...p, departureFrom: e.target.value }))} /></Field>
                    <Field label="Sosire acasă"><Input type="time" value={f.arrivalBack} onChange={e => setF(p => ({ ...p, arrivalBack: e.target.value }))} /></Field>
                  </div>
                  {(f.fieldHours > 0 || f.travelHours > 0) && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="bg-teal-50 rounded-[10px] px-3 py-2 text-center">
                        <div className="text-[9px] text-teal-600 font-bold">TEREN</div>
                        <div className="font-mono font-bold text-teal-600 text-base">{formatHours(parseFloat(f.fieldHours) || 0)}</div>
                      </div>
                      <div className="bg-blue-50 rounded-[10px] px-3 py-2 text-center">
                        <div className="text-[9px] text-blue-600 font-bold">DEPLASARE</div>
                        <div className="font-mono font-bold text-blue-600 text-base">{formatHours(parseFloat(f.travelHours) || 0)}</div>
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
      <div className={sectionCls}>
        <button type="button" className={sectionHeadCls} onClick={() => setF(p => ({ ...p, officeEnabled: !p.officeEnabled }))}>
          <span className="flex items-center gap-2">
            <Monitor size={15} /> Activitate birou
            {f.officeEnabled && <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">ACTIV</span>}
          </span>
          <span className="text-slate-400 text-[10px]">{f.officeEnabled ? "▲" : "▼"}</span>
        </button>
        {f.officeEnabled && (
          <div className="px-3.5 pb-3.5 border-t border-slate-100">
            <Field label="Tip activitate">
              <div className="flex flex-wrap gap-2 mt-3">
                {OFFICE_TYPES.map(t => (
                  <button key={t} type="button" onClick={() => toggleOffType(t)}
                    className={`px-3 py-1.5 rounded-[10px] text-xs font-semibold cursor-pointer border-none font-sans transition-all duration-150 ${
                      f.officeTypes.includes(t) ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Descriere">
              <Textarea value={f.officeDescription} onChange={e => setF(p => ({ ...p, officeDescription: e.target.value }))} placeholder="Detalii..." style={{ minHeight: 56 }} />
            </Field>
            <div className="border-t border-dashed border-slate-100 pt-3">
              <label className="cad-label mb-2">Timp birou</label>
              <div className="flex gap-2 mb-2.5">
                {["manual", "auto"].map(m => (
                  <button key={m} type="button" onClick={() => setF(p => ({ ...p, officetimeMode: m }))} className={modeBtnCls(f.officetimeMode === m)}>
                    {m === "manual" ? <><Pencil size={12} /> Manual</> : <><Clock size={12} /> Automat</>}
                  </button>
                ))}
              </div>
              {f.officetimeMode === "manual"
                ? <Field label="Ore birou"><Input type="number" min="0" step="0.5" value={f.officeHours} onChange={e => setF(p => ({ ...p, officeHours: e.target.value }))} placeholder="0" /></Field>
                : <div className="grid grid-cols-2 gap-2.5">
                    <Field label="Ora început"><Input type="time" value={f.officeStart} onChange={e => setF(p => ({ ...p, officeStart: e.target.value }))} /></Field>
                    <Field label="Ora sfârșit"><Input type="time" value={f.officeEnd} onChange={e => setF(p => ({ ...p, officeEnd: e.target.value }))} /></Field>
                  </div>
              }
            </div>
          </div>
        )}
      </div>

      <Field label="Observații">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {QUICK_OBS.map(obs => (
            <button key={obs} type="button"
              onClick={() => setF(p => ({ ...p, observations: p.observations ? p.observations + ". " + obs : obs }))}
              className="inline-flex items-center gap-1 text-[11px] bg-slate-100 border-none rounded-full px-2.5 py-1 cursor-pointer text-slate-600 font-sans hover:bg-slate-200 transition-colors duration-100">
              <Zap size={10} />{obs}
            </button>
          ))}
        </div>
        <Textarea value={f.observations} onChange={e => setF(p => ({ ...p, observations: e.target.value }))} placeholder="Observații..." />
      </Field>
    </Modal>
  );
}
