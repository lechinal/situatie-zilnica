import { createContext, useContext } from "react";
import { useLS } from "../hooks/useLocalStorage.js";

const Ctx = createContext(null);
const genId = (p = "id") => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const DEFAULT_COLLEAGUES = [
  { id: "col-1", name: "Dragoș" },
  { id: "col-2", name: "Ștefan" },
  { id: "col-3", name: "Ionel" },
];

export function AppProvider({ children }) {
  const [finances,   setFinances]   = useLS("cad_finances",   []);
  const [uats,       setUats]       = useLS("cad_uats",       []);
  const [localities, setLocalities] = useLS("cad_localities", []);
  const [sectors,    setSectors]    = useLS("cad_sectors",    []);
  const [activities, setActivities] = useLS("cad_activities", []);
  const [colleagues, setColleagues] = useLS("cad_colleagues", DEFAULT_COLLEAGUES);

  // ── Finanțări ──
  const addFinance    = (d) => { const f = { id: genId("fin"), createdAt: new Date().toISOString(), ...d }; setFinances(p => [...p, f]); return f; };
  const updateFinance = (id, d) => setFinances(p => p.map(f => f.id === id ? { ...f, ...d } : f));
  const deleteFinance = (id) => {
    const uatIds = uats.filter(u => u.financeId === id).map(u => u.id);
    const locIds = localities.filter(l => uatIds.includes(l.uatId)).map(l => l.id);
    const secIds = sectors.filter(s => locIds.includes(s.localityId)).map(s => s.id);
    setActivities(p => p.filter(a => !secIds.includes(a.sectorId)));
    setSectors(p => p.filter(s => !locIds.includes(s.localityId)));
    setLocalities(p => p.filter(l => !uatIds.includes(l.uatId)));
    setUats(p => p.filter(u => u.financeId !== id));
    setFinances(p => p.filter(f => f.id !== id));
  };

  // ── UAT-uri ──
  const addUat    = (d) => { const u = { id: genId("uat"), createdAt: new Date().toISOString(), ...d }; setUats(p => [...p, u]); return u; };
  const updateUat = (id, d) => setUats(p => p.map(u => u.id === id ? { ...u, ...d } : u));
  const deleteUat = (id) => {
    const locIds = localities.filter(l => l.uatId === id).map(l => l.id);
    const secIds = sectors.filter(s => locIds.includes(s.localityId)).map(s => s.id);
    setActivities(p => p.filter(a => !secIds.includes(a.sectorId)));
    setSectors(p => p.filter(s => !locIds.includes(s.localityId)));
    setLocalities(p => p.filter(l => l.uatId !== id));
    setUats(p => p.filter(u => u.id !== id));
  };

  // ── Localități ──
  const addLocality    = (d) => { const l = { id: genId("loc"), createdAt: new Date().toISOString(), ...d }; setLocalities(p => [...p, l]); return l; };
  const updateLocality = (id, d) => setLocalities(p => p.map(l => l.id === id ? { ...l, ...d } : l));
  const deleteLocality = (id) => {
    const secIds = sectors.filter(s => s.localityId === id).map(s => s.id);
    setActivities(p => p.filter(a => !secIds.includes(a.sectorId)));
    setSectors(p => p.filter(s => s.localityId !== id));
    setLocalities(p => p.filter(l => l.id !== id));
  };

  // ── Sectoare ──
  const addSector    = (d) => { const s = { id: genId("sec"), progress: 0, status: "Neînceput", updatedAt: new Date().toISOString(), createdAt: new Date().toISOString(), ...d }; setSectors(p => [...p, s]); return s; };
  const updateSector = (id, d) => setSectors(p => p.map(s => s.id === id ? { ...s, ...d, updatedAt: new Date().toISOString() } : s));
  const deleteSector = (id) => { setActivities(p => p.filter(a => a.sectorId !== id)); setSectors(p => p.filter(s => s.id !== id)); };

  // ── Activități ──
  const addActivity = (d) => {
    const a = { id: genId("act"), createdAt: new Date().toISOString(), ...d };
    setActivities(p => [...p, a]);
    if (d.progressNew !== undefined) updateSector(d.sectorId, { progress: d.progressNew, ...(d.sectorStatus ? { status: d.sectorStatus } : {}) });
    return a;
  };
  const deleteActivity = (id) => setActivities(p => p.filter(a => a.id !== id));

  // ── Colegi ──
  const addColleague    = (name) => setColleagues(p => [...p, { id: genId("col"), name: name.trim() }]);
  const deleteColleague = (id)   => setColleagues(p => p.filter(c => c.id !== id));

  // ── Backup ──
  const exportData = () => {
    const data = { version: "2.0", exportedAt: new Date().toISOString(), finances, uats, localities, sectors, activities, colleagues };
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    a.download = `cadastru-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };
  const importData = (json) => {
    try {
      const d = JSON.parse(json);
      if (d.finances)   setFinances(d.finances);
      if (d.uats)       setUats(d.uats);
      if (d.localities) setLocalities(d.localities);
      if (d.sectors)    setSectors(d.sectors);
      if (d.activities) setActivities(d.activities);
      if (d.colleagues) setColleagues(d.colleagues);
      return true;
    } catch { return false; }
  };

  // ── Getters ──
  const getFinanceById        = (id)  => finances.find(f => f.id === id);
  const getUatById            = (id)  => uats.find(u => u.id === id);
  const getLocalityById       = (id)  => localities.find(l => l.id === id);
  const getSectorById         = (id)  => sectors.find(s => s.id === id);
  const getUatsByFinance      = (fid) => uats.filter(u => u.financeId === fid);
  const getLocalitiesByUat    = (uid) => localities.filter(l => l.uatId === uid);
  const getSectorsByLocality  = (lid) => sectors.filter(s => s.localityId === lid);
  const getActivitiesBySector = (sid) => activities
    .filter(a => a.sectorId === sid)
    .sort((a, b) => new Date(a.date + "T12:00:00") - new Date(b.date + "T12:00:00"));

  const getSectorsByFinance = (fid) => {
    const uatIds = uats.filter(u => u.financeId === fid).map(u => u.id);
    const locIds = localities.filter(l => uatIds.includes(l.uatId)).map(l => l.id);
    return sectors.filter(s => locIds.includes(s.localityId));
  };

  const getSectorsByUat = (uid) => {
    const locIds = localities.filter(l => l.uatId === uid).map(l => l.id);
    return sectors.filter(s => locIds.includes(s.localityId));
  };

  return (
    <Ctx.Provider value={{
      finances, uats, localities, sectors, activities, colleagues,
      addFinance, updateFinance, deleteFinance,
      addUat, updateUat, deleteUat,
      addLocality, updateLocality, deleteLocality,
      addSector, updateSector, deleteSector,
      addActivity, deleteActivity,
      addColleague, deleteColleague,
      exportData, importData,
      getFinanceById, getUatById, getLocalityById, getSectorById,
      getUatsByFinance, getLocalitiesByUat, getSectorsByLocality,
      getActivitiesBySector, getSectorsByFinance, getSectorsByUat,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => useContext(Ctx);
