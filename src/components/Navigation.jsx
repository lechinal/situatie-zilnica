import { useState } from "react";
import logoImg from "../assets/images/logo/logo.jpeg";

const NAV_ITEMS = [
  { id: "dashboard",  label: "Dashboard",  icon: "⊞" },
  { id: "statistics", label: "Statistici", icon: "📊" },
  { id: "settings",   label: "Setări",     icon: "⚙️" },
];

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <img src={logoImg} alt="Logo" className="cad-logo-img" />
      <div>
        <div className="cad-logo-name">Cadastru Sistematic</div>
        <div className="cad-logo-sub">Situație Zilnică</div>
      </div>
    </div>
  );
}

function NavLinks({ activeId, onNav, onClickItem }) {
  return (
    <>
      {NAV_ITEMS.map(item => {
        const active = activeId === item.id;
        return (
          <button key={item.id} onClick={() => { onNav(item.id); onClickItem?.(); }}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500, marginBottom: 2, transition: "all .15s", background: active ? "#0d9488" : "transparent", color: active ? "#fff" : "#475569" }}>
            <span>{item.icon}</span> {item.label}
          </button>
        );
      })}
    </>
  );
}

export default function Navigation({ page, onNav }) {
  const activeId = ["dashboard","finance","uat","locality","sector"].includes(page) ? "dashboard" : page;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <aside className="cad-sidebar" style={{ background: "#fff", borderRight: "1px solid #f1f5f9", height: "100vh", position: "sticky", top: 0, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid #f1f5f9" }}><Logo /></div>
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          <NavLinks activeId={activeId} onNav={onNav} />
        </nav>
        <div style={{ padding: "14px 16px", borderTop: "1px solid #f1f5f9", fontSize: 10, color: "#cbd5e1", letterSpacing: "0.05em" }}>v2.0 · 2026</div>
      </aside>

      <div className="cad-topbar" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "#fff", borderBottom: "1px solid #f1f5f9", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Logo />
        <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#475569", padding: 4 }}>☰</button>
      </div>

      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 60, display: "flex" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: 240, background: "#fff", height: "100%", display: "flex", flexDirection: "column", boxShadow: "4px 0 24px rgba(0,0,0,.12)", animation: "slideInLeft .22s ease" }}>
            <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Logo />
              <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 18, padding: 4 }}>✕</button>
            </div>
            <nav style={{ flex: 1, padding: "12px 10px" }}>
              <NavLinks activeId={activeId} onNav={onNav} onClickItem={() => setMobileOpen(false)} />
            </nav>
            <div style={{ padding: "12px 16px", borderTop: "1px solid #f1f5f9", fontSize: 10, color: "#cbd5e1" }}>v2.0 · 2026</div>
          </div>
        </div>
      )}
    </>
  );
}
