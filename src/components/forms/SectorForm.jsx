import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { Modal, Field, Input, Select, Btn } from "../ui/index.jsx";
import { STATUS_OPTIONS, ZONE_TYPES } from "../../utils/constants.js";

export default function SectorForm({ isOpen, onClose, localityId, editSector }) {
  const { addSector, updateSector } = useApp();
  const [form, setForm] = useState({ sectorNumber: "", zoneType: "Intravilan", status: "Neînceput", progress: 0 });
  const [err,  setErr]  = useState({});

  useEffect(() => {
    setForm({
      sectorNumber: editSector?.sectorNumber || "",
      zoneType:     editSector?.zoneType     || "Intravilan",
      status:       editSector?.status       || "Neînceput",
      progress:     editSector?.progress     || 0,
    });
    setErr({});
  }, [editSector, isOpen]);

  const submit = () => {
    if (!form.sectorNumber.toString().trim()) { setErr({ sectorNumber: "Obligatoriu" }); return; }
    const data = { ...form, sectorNumber: form.sectorNumber.toString(), progress: parseFloat(form.progress) || 0, localityId };
    editSector ? updateSector(editSector.id, data) : addSector(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editSector ? "Editează sectorul" : "Sector nou"}
      footer={<><Btn variant="secondary" onClick={onClose}>Anulează</Btn><Btn onClick={submit}>{editSector ? "Salvează" : "Creează"}</Btn></>}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Nr. Sector *" error={err.sectorNumber}>
          <Input value={form.sectorNumber} onChange={e => setForm(p => ({ ...p, sectorNumber: e.target.value }))} onKeyDown={e => e.key === "Enter" && submit()} placeholder="ex: 53" error={err.sectorNumber} autoFocus />
        </Field>
        <Field label="Tip zonă">
          <Select value={form.zoneType} onChange={e => setForm(p => ({ ...p, zoneType: e.target.value }))}>
            {ZONE_TYPES.map(z => <option key={z}>{z}</option>)}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="Progres (%)">
          <Input type="number" min="0" max="100" value={form.progress} onChange={e => setForm(p => ({ ...p, progress: e.target.value }))} />
        </Field>
      </div>
    </Modal>
  );
}
