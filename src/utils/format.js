export const calcNewProgress = (prev, today) =>
  Math.min(100, Math.max(0, (parseFloat(prev) || 0) + (parseFloat(today) || 0)));

export const avgProgress = (secs) => {
  if (!secs.length) return 0;
  return Math.round(secs.reduce((s, x) => s + (parseFloat(x.progress) || 0), 0) / secs.length);
};

export const formatHours = (h) => {
  if (!h || h <= 0) return "0h";
  const hrs = Math.floor(h), min = Math.round((h - hrs) * 60);
  if (hrs === 0) return `${min}m`;
  if (min === 0) return `${hrs}h`;
  return `${hrs}h ${min}m`;
};

export const calcBetween = (s, e) => {
  if (!s || !e) return 0;
  const [sh, sm] = s.split(":").map(Number), [eh, em] = e.split(":").map(Number);
  const diff = (eh * 60 + em) - (sh * 60 + sm);
  return diff > 0 ? diff / 60 : 0;
};

export const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d + "T12:00:00").toLocaleDateString("ro-RO", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export const fmtDateLong = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("ro-RO", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};
