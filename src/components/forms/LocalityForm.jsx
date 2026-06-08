import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { Modal, Field, Input, Btn } from "../ui/index.jsx";

export default function LocalityForm({ isOpen, onClose, uatId, editLocality }) {
  const { addLocality, updateLocality } = useApp();
  const [form, setForm] = useState({ name: "" });
  const [err,  setErr]  = useState({});

  useEffect(() => {
    setForm({ name: editLocality?.name || "" });
    setErr({});
  }, [editLocality, isOpen]);

  const submit = () => {
    if (!form.name.trim()) { setErr({ name: "Numele localității este obligatoriu" }); return; }
    editLocality ? updateLocality(editLocality.id, { name: form.name.trim() }) : addLocality({ name: form.name.trim(), uatId });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editLocality ? "Editează localitate" : "Localitate nouă"}
      footer={<><Btn variant="secondary" onClick={onClose}>Anulează</Btn><Btn onClick={submit}>{editLocality ? "Salvează" : "Creează"}</Btn></>}>
      <Field label="Nume localitate *" error={err.name}>
        <Input value={form.name} onChange={e => setForm({ name: e.target.value })} placeholder="ex: Secașel" error={err.name} autoFocus />
      </Field>
    </Modal>
  );
}
