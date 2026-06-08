import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { Modal, Field, Input, Textarea, Btn } from "../ui/index.jsx";

export default function FinanceForm({ isOpen, onClose, editFinance }) {
  const { addFinance, updateFinance } = useApp();
  const [form, setForm] = useState({ name: "", description: "" });
  const [err,  setErr]  = useState({});

  useEffect(() => {
    setForm({ name: editFinance?.name || "", description: editFinance?.description || "" });
    setErr({});
  }, [editFinance, isOpen]);

  const submit = () => {
    if (!form.name.trim()) { setErr({ name: "Numele este obligatoriu" }); return; }
    editFinance ? updateFinance(editFinance.id, form) : addFinance(form);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editFinance ? "Editează finanțarea" : "Finanțare nouă"}
      footer={<><Btn variant="secondary" onClick={onClose}>Anulează</Btn><Btn onClick={submit}>{editFinance ? "Salvează" : "Creează"}</Btn></>}>
      <Field label="Nume *" error={err.name}>
        <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="ex: Finanțare 13" error={err.name} autoFocus />
      </Field>
      <Field label="Descriere (opțional)">
        <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Detalii..." />
      </Field>
    </Modal>
  );
}
