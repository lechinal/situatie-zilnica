import { useState, useCallback } from "react";

export function useLS(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
    catch { return init; }
  });
  const set = useCallback((v) => {
    setVal(prev => {
      const toStore = typeof v === "function" ? v(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(toStore)); } catch {}
      return toStore;
    });
  }, [key]);
  return [val, set];
}
