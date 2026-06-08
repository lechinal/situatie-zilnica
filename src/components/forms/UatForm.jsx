import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { Modal, Field, Input, Btn } from "../ui/index.jsx";

export default function UatForm({ isOpen, onClose, financeId, editUat }) {
  const { addUat, updateUat } = useApp();
  const [form, setForm] = useState({ name: "" });
  const [err,  setErr]  = useState({});

  useEffect(() => {
    setForm({ name: editUat?.name || "" });
    setErr({});
  }, [editUat, isOpen]);

  const submit = () => {
    if (!form.name.trim()) { setErr({ name: "Numele UAT este obligatoriu" }); return; }
    editUat ? updateUat(editUat.id, { name: form.name.trim() }) : addUat({ name: form.name.trim(), financeId });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editUat ? "Editează UAT" : "UAT nou"}
      footer={<><Btn variant="secondary" onClick={onClose}>Anulează</Btn><Btn onClick={submit}>{editUat ? "Salvează" : "Creează"}</Btn></>}>
      <Field label="Nume UAT *" error={err.name}>
        <Input value={form.name} onChange={e => setForm({ name: e.target.value })} placeholder="ex: Ohaba" error={err.name} autoFocus />
      </Field>
    </Modal>
  );
}
