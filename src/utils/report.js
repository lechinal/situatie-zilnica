import { fmtDate, formatHours } from "./format.js";

export function genReport(act, sector, locality, uat, finance) {
  const date = fmtDate(act.date);
  const fin  = finance?.name  || "";
  const uatN = uat?.name      || "";
  const loc  = locality?.name || "";
  const nr   = sector?.sectorNumber || "";
  const zone = (sector?.zoneType || "").toLowerCase();
  const parts = [];

  if (act.fieldActivity?.enabled) {
    const fa = act.fieldActivity;
    let line = `${date} - ${fin} - UAT ${uatN} - ${loc} - Sector ${nr} - ${zone} - ${(fa.interventionType || "").toLowerCase()}`;
    if (fa.intravilanBuildings > 0) line += ` - măsurat ${fa.intravilanBuildings} imobile`;
    if (fa.extravilanElements?.length) line += ` - ${fa.extravilanElements.map(e => e.type.toLowerCase()).join(", ")}`;
    if (act.progressToday > 0) line += ` - progres sector +${act.progressToday}%`;
    if (act.fieldHours  > 0) line += ` - timp teren ${formatHours(act.fieldHours)}`;
    if (act.travelHours > 0) line += ` - timp deplasare ${formatHours(act.travelHours)}`;
    if (act.team?.length > 1) {
      const others = act.team.slice(0, -1).join(", "), last = act.team[act.team.length - 1];
      line += ` - cu ${others} și ${last}`;
    } else if (act.team?.length === 1) {
      line += ` - cu ${act.team[0]}`;
    }
    parts.push(line);
  }

  if (act.officeActivity?.enabled) {
    const oa = act.officeActivity;
    const types = oa.types?.join(", ").toLowerCase() || "activitate birou";
    let line = `${date} - ${fin} - UAT ${uatN} - ${loc} - Sector ${nr} - activitate birou: ${types}`;
    if (act.officeHours > 0) line += ` - ${formatHours(act.officeHours)}`;
    parts.push(line);
  }

  if (!parts.length) {
    let line = `${date} - ${fin} - UAT ${uatN} - ${loc} - Sector ${nr}`;
    if (act.progressToday > 0) line += ` - progres +${act.progressToday}%`;
    parts.push(line);
  }

  if (act.observations?.trim()) parts.push(`📝 ${act.observations.trim()}`);
  return parts.join("\n");
}
