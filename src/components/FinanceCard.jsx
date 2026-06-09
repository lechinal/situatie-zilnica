import { Folder } from "lucide-react";
import { avgProgress } from "../utils/format.js";
import HierarchyCard from "./HierarchyCard.jsx";

export default function FinanceCard({ finance, uats, sectors, onSelect, onEdit, onDelete }) {
  const avg         = avgProgress(sectors);
  const finishedSec = sectors.filter(s => s.status === "Finalizat").length;
  return (
    <HierarchyCard
      icon={Folder} title={finance.name} subtitle={finance.description}
      accentColor="#0d9488"
      stats={[`${uats.length} UAT-uri`, `${sectors.length} sectoare`, `Progres mediu ${avg}%`, `${finishedSec} finalizate`]}
      onSelect={onSelect} onEdit={onEdit} onDelete={onDelete}
      confirmMsg={`Vei șterge "${finance.name}" și toate datele aferente (UAT-uri, localități, sectoare, activități).`}
    />
  );
}
