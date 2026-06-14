import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

const Ctx = createContext(null);
const genId = (p = "id") => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const fromDB = {
  finance:   r => ({ id: r.id, name: r.name, description: r.description, createdAt: r.created_at }),
  uat:       r => ({ id: r.id, name: r.name, financeId: r.finance_id, createdAt: r.created_at }),
  locality:  r => ({ id: r.id, name: r.name, uatId: r.uat_id, createdAt: r.created_at }),
  sector:    r => ({ id: r.id, localityId: r.locality_id, sectorNumber: r.sector_number, zoneType: r.zone_type, status: r.status, progress: r.progress, createdAt: r.created_at, updatedAt: r.updated_at }),
  activity:  r => ({ id: r.id, sectorId: r.sector_id, date: r.date, team: r.team || [], observations: r.observations, progressPrev: r.progress_prev, progressToday: r.progress_today, progressNew: r.progress_new, sectorStatus: r.sector_status, fieldHours: r.field_hours, travelHours: r.travel_hours, officeHours: r.office_hours, fieldActivity: r.field_activity, officeActivity: r.office_activity, createdAt: r.created_at }),
  colleague: r => ({ id: r.id, name: r.name, pin: r.pin || null, role: r.role || "user" }),
  auditLog:  r => ({ id: r.id, author: r.author, action: r.action, tableName: r.table_name, recordId: r.record_id, description: r.description, createdAt: r.created_at }),
};

const toDB = {
  finance:   d => ({ id: d.id, name: d.name, description: d.description, created_at: d.createdAt }),
  uat:       d => ({ id: d.id, name: d.name, finance_id: d.financeId, created_at: d.createdAt }),
  locality:  d => ({ id: d.id, name: d.name, uat_id: d.uatId, created_at: d.createdAt }),
  sector:    d => ({ id: d.id, locality_id: d.localityId, sector_number: d.sectorNumber, zone_type: d.zoneType, status: d.status, progress: d.progress, created_at: d.createdAt, updated_at: d.updatedAt }),
  activity:  d => ({ id: d.id, sector_id: d.sectorId, date: d.date, team: d.team, observations: d.observations, progress_prev: d.progressPrev, progress_today: d.progressToday, progress_new: d.progressNew, sector_status: d.sectorStatus, field_hours: d.fieldHours, travel_hours: d.travelHours, office_hours: d.officeHours, field_activity: d.fieldActivity, office_activity: d.officeActivity, created_at: d.createdAt }),
  colleague: d => ({ id: d.id, name: d.name, pin: d.pin || null, role: d.role || "user" }),
};

export function AppProvider({ children }) {
  const [finances,   setFinances]   = useState([]);
  const [uats,       setUats]       = useState([]);
  const [localities, setLocalities] = useState([]);
  const [sectors,    setSectors]    = useState([]);
  const [activities, setActivities] = useState([]);
  const [colleagues, setColleagues] = useState([]);
  const [auditLogs,  setAuditLogs]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [currentUser, setCurrentUserState] = useState(() => {
    const name = localStorage.getItem("cad_current_user");
    const role = localStorage.getItem("cad_current_role");
    if (name && !role) { localStorage.removeItem("cad_current_user"); return null; }
    return name || null;
  });
  const [currentUserRole, setCurrentUserRoleState] = useState(() => {
    const name = localStorage.getItem("cad_current_user");
    const role = localStorage.getItem("cad_current_role");
    return (name && role) ? role : null;
  });

  const setCurrentUser = (name, role = "user") => {
    localStorage.setItem("cad_current_user", name);
    localStorage.setItem("cad_current_role", role);
    setCurrentUserState(name);
    setCurrentUserRoleState(role);
  };

  const logout = () => {
    localStorage.removeItem("cad_current_user");
    localStorage.removeItem("cad_current_role");
    setCurrentUserState(null);
    setCurrentUserRoleState(null);
  };

  const verifyPin = async (name, pin) => {
    const { data, error } = await supabase.from("colleagues").select("role, pin").eq("name", name).single();
    if (error || !data) return null;
    if (data.pin === pin) return data.role || "user";
    return null;
  };

  const setColleaguePin = async (id, pin) => {
    setColleagues(p => p.map(c => c.id === id ? { ...c, pin } : c));
    await supabase.from("colleagues").update({ pin }).eq("id", id);
  };

  useEffect(() => {
    (async () => {
      const [fin, uat, loc, sec, act, col, logs] = await Promise.all([
        supabase.from("finances").select("*"),
        supabase.from("uats").select("*"),
        supabase.from("localities").select("*"),
        supabase.from("sectors").select("*"),
        supabase.from("activities").select("*"),
        supabase.from("colleagues").select("*"),
        supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100),
      ]);
      setFinances(  (fin.data  || []).map(fromDB.finance));
      setUats(      (uat.data  || []).map(fromDB.uat));
      setLocalities((loc.data  || []).map(fromDB.locality));
      setSectors(   (sec.data  || []).map(fromDB.sector));
      setActivities((act.data  || []).map(fromDB.activity));
      setAuditLogs( (logs.data || []).map(fromDB.auditLog));

      let cols = (col.data || []).map(fromDB.colleague);
      if (cols.length === 0) {
        const defaults = [
          { id: "col-1", name: "Dragoș", pin: null, role: "user" },
          { id: "col-2", name: "Ștefan", pin: null, role: "user" },
          { id: "col-3", name: "Ionel",  pin: null, role: "user" },
        ];
        await supabase.from("colleagues").insert(defaults);
        cols = defaults;
      }
      setColleagues(cols);
      setLoading(false);
    })();
  }, []);

  const logAudit = async (action, tableName, recordId, description) => {
    const author = localStorage.getItem("cad_current_user") || "Necunoscut";
    const entry = { id: genId("log"), author, action, tableName, recordId, description, createdAt: new Date().toISOString() };
    setAuditLogs(p => [entry, ...p].slice(0, 100));
    await supabase.from("audit_logs").insert({
      id: entry.id, author, action, table_name: tableName, record_id: recordId, description, created_at: entry.createdAt,
    });
  };

  // ── Finanțări ──
  const addFinance = async (d) => {
    const f = { id: genId("fin"), createdAt: new Date().toISOString(), ...d };
    setFinances(p => [...p, f]);
    await supabase.from("finances").insert(toDB.finance(f));
    await logAudit("CREATE", "finances", f.id, `A adăugat finanțarea "${f.name}"`);
    return f;
  };
  const updateFinance = async (id, d) => {
    const cur = finances.find(f => f.id === id);
    setFinances(p => p.map(f => f.id === id ? { ...f, ...d } : f));
    await supabase.from("finances").update(toDB.finance({ ...cur, ...d })).eq("id", id);
    await logAudit("UPDATE", "finances", id, `A modificat finanțarea "${cur?.name}"`);
  };
  const deleteFinance = async (id) => {
    const name = finances.find(f => f.id === id)?.name;
    const uatIds = uats.filter(u => u.financeId === id).map(u => u.id);
    const locIds = localities.filter(l => uatIds.includes(l.uatId)).map(l => l.id);
    const secIds = sectors.filter(s => locIds.includes(s.localityId)).map(s => s.id);
    setActivities(p => p.filter(a => !secIds.includes(a.sectorId)));
    setSectors(p => p.filter(s => !locIds.includes(s.localityId)));
    setLocalities(p => p.filter(l => !uatIds.includes(l.uatId)));
    setUats(p => p.filter(u => u.financeId !== id));
    setFinances(p => p.filter(f => f.id !== id));
    if (secIds.length)  await supabase.from("activities").delete().in("sector_id", secIds);
    if (locIds.length)  await supabase.from("sectors").delete().in("locality_id", locIds);
    if (uatIds.length)  await supabase.from("localities").delete().in("uat_id", uatIds);
    await supabase.from("uats").delete().eq("finance_id", id);
    await supabase.from("finances").delete().eq("id", id);
    await logAudit("DELETE", "finances", id, `A șters finanțarea "${name}"`);
  };

  // ── UAT-uri ──
  const addUat = async (d) => {
    const u = { id: genId("uat"), createdAt: new Date().toISOString(), ...d };
    setUats(p => [...p, u]);
    await supabase.from("uats").insert(toDB.uat(u));
    await logAudit("CREATE", "uats", u.id, `A adăugat UAT-ul "${u.name}"`);
    return u;
  };
  const updateUat = async (id, d) => {
    const cur = uats.find(u => u.id === id);
    setUats(p => p.map(u => u.id === id ? { ...u, ...d } : u));
    await supabase.from("uats").update(toDB.uat({ ...cur, ...d })).eq("id", id);
    await logAudit("UPDATE", "uats", id, `A modificat UAT-ul "${cur?.name}"`);
  };
  const deleteUat = async (id) => {
    const name = uats.find(u => u.id === id)?.name;
    const locIds = localities.filter(l => l.uatId === id).map(l => l.id);
    const secIds = sectors.filter(s => locIds.includes(s.localityId)).map(s => s.id);
    setActivities(p => p.filter(a => !secIds.includes(a.sectorId)));
    setSectors(p => p.filter(s => !locIds.includes(s.localityId)));
    setLocalities(p => p.filter(l => l.uatId !== id));
    setUats(p => p.filter(u => u.id !== id));
    if (secIds.length) await supabase.from("activities").delete().in("sector_id", secIds);
    if (locIds.length) await supabase.from("sectors").delete().in("locality_id", locIds);
    await supabase.from("localities").delete().eq("uat_id", id);
    await supabase.from("uats").delete().eq("id", id);
    await logAudit("DELETE", "uats", id, `A șters UAT-ul "${name}"`);
  };

  // ── Localități ──
  const addLocality = async (d) => {
    const l = { id: genId("loc"), createdAt: new Date().toISOString(), ...d };
    setLocalities(p => [...p, l]);
    await supabase.from("localities").insert(toDB.locality(l));
    await logAudit("CREATE", "localities", l.id, `A adăugat localitatea "${l.name}"`);
    return l;
  };
  const updateLocality = async (id, d) => {
    const cur = localities.find(l => l.id === id);
    setLocalities(p => p.map(l => l.id === id ? { ...l, ...d } : l));
    await supabase.from("localities").update(toDB.locality({ ...cur, ...d })).eq("id", id);
    await logAudit("UPDATE", "localities", id, `A modificat localitatea "${cur?.name}"`);
  };
  const deleteLocality = async (id) => {
    const name = localities.find(l => l.id === id)?.name;
    const secIds = sectors.filter(s => s.localityId === id).map(s => s.id);
    setActivities(p => p.filter(a => !secIds.includes(a.sectorId)));
    setSectors(p => p.filter(s => s.localityId !== id));
    setLocalities(p => p.filter(l => l.id !== id));
    if (secIds.length) await supabase.from("activities").delete().in("sector_id", secIds);
    await supabase.from("sectors").delete().eq("locality_id", id);
    await supabase.from("localities").delete().eq("id", id);
    await logAudit("DELETE", "localities", id, `A șters localitatea "${name}"`);
  };

  // ── Sectoare ──
  const addSector = async (d) => {
    const s = { id: genId("sec"), progress: 0, status: "Neînceput", updatedAt: new Date().toISOString(), createdAt: new Date().toISOString(), ...d };
    setSectors(p => [...p, s]);
    await supabase.from("sectors").insert(toDB.sector(s));
    await logAudit("CREATE", "sectors", s.id, `A adăugat Sectorul ${s.sectorNumber}`);
    return s;
  };
  const updateSector = async (id, d, silent = false) => {
    const cur = sectors.find(s => s.id === id);
    const updated = { ...cur, ...d, updatedAt: new Date().toISOString() };
    setSectors(p => p.map(s => s.id === id ? updated : s));
    await supabase.from("sectors").update(toDB.sector(updated)).eq("id", id);
    if (!silent) await logAudit("UPDATE", "sectors", id, `A modificat Sectorul ${cur?.sectorNumber}`);
  };
  const deleteSector = async (id) => {
    const sectorNumber = sectors.find(s => s.id === id)?.sectorNumber;
    setActivities(p => p.filter(a => a.sectorId !== id));
    setSectors(p => p.filter(s => s.id !== id));
    await supabase.from("activities").delete().eq("sector_id", id);
    await supabase.from("sectors").delete().eq("id", id);
    await logAudit("DELETE", "sectors", id, `A șters Sectorul ${sectorNumber}`);
  };

  // ── Activități ──
  const addActivity = async (d) => {
    const a = { id: genId("act"), createdAt: new Date().toISOString(), ...d };
    const sectorNumber = sectors.find(s => s.id === d.sectorId)?.sectorNumber;
    setActivities(p => [...p, a]);
    if (d.progressNew !== undefined)
      await updateSector(d.sectorId, { progress: d.progressNew, ...(d.sectorStatus ? { status: d.sectorStatus } : {}) }, true);
    await supabase.from("activities").insert(toDB.activity(a));
    await logAudit("CREATE", "activities", a.id, `A adăugat activitate pe Sectorul ${sectorNumber} (${d.date})`);
    return a;
  };
  const updateActivity = async (id, d) => {
    const cur = activities.find(a => a.id === id);
    const sectorNumber = sectors.find(s => s.id === d.sectorId)?.sectorNumber;
    setActivities(p => p.map(a => a.id === id ? { ...a, ...d } : a));
    if (d.progressNew !== undefined)
      await updateSector(d.sectorId, { progress: d.progressNew, ...(d.sectorStatus ? { status: d.sectorStatus } : {}) }, true);
    await supabase.from("activities").update(toDB.activity({ ...cur, ...d })).eq("id", id);
    await logAudit("UPDATE", "activities", id, `A modificat activitate pe Sectorul ${sectorNumber}`);
  };
  const deleteActivity = async (id) => {
    const act = activities.find(a => a.id === id);
    const sectorNumber = sectors.find(s => s.id === act?.sectorId)?.sectorNumber;
    setActivities(p => p.filter(a => a.id !== id));
    await supabase.from("activities").delete().eq("id", id);
    await logAudit("DELETE", "activities", id, `A șters activitate din Sectorul ${sectorNumber}`);
  };

  // ── Colegi ──
  const addColleague = async (name) => {
    const c = { id: genId("col"), name: name.trim(), pin: null, role: "user" };
    setColleagues(p => [...p, c]);
    await supabase.from("colleagues").insert(toDB.colleague(c));
    await logAudit("CREATE", "colleagues", c.id, `A adăugat colegul "${c.name}"`);
  };
  const deleteColleague = async (id) => {
    const name = colleagues.find(c => c.id === id)?.name;
    setColleagues(p => p.filter(c => c.id !== id));
    await supabase.from("colleagues").delete().eq("id", id);
    await logAudit("DELETE", "colleagues", id, `A șters colegul "${name}"`);
  };

  // ── Backup ──
  const exportData = () => {
    const data = { version: "2.0", exportedAt: new Date().toISOString(), finances, uats, localities, sectors, activities, colleagues };
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    a.download = `cadastru-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };
  const importData = async (json) => {
    try {
      const d = JSON.parse(json);
      if (d.finances)   { setFinances(d.finances);     await supabase.from("finances").upsert(d.finances.map(toDB.finance)); }
      if (d.uats)       { setUats(d.uats);             await supabase.from("uats").upsert(d.uats.map(toDB.uat)); }
      if (d.localities) { setLocalities(d.localities); await supabase.from("localities").upsert(d.localities.map(toDB.locality)); }
      if (d.sectors)    { setSectors(d.sectors);       await supabase.from("sectors").upsert(d.sectors.map(toDB.sector)); }
      if (d.activities) { setActivities(d.activities); await supabase.from("activities").upsert(d.activities.map(toDB.activity)); }
      if (d.colleagues) { setColleagues(d.colleagues); await supabase.from("colleagues").upsert(d.colleagues.map(toDB.colleague)); }
      await logAudit("IMPORT", "backup", null, `A importat backup din ${new Date().toLocaleDateString("ro-RO")}`);
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
      finances, uats, localities, sectors, activities, colleagues, auditLogs, loading,
      currentUser, currentUserRole, setCurrentUser, logout, verifyPin, setColleaguePin,
      addFinance, updateFinance, deleteFinance,
      addUat, updateUat, deleteUat,
      addLocality, updateLocality, deleteLocality,
      addSector, updateSector, deleteSector,
      addActivity, updateActivity, deleteActivity,
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
