import { useState } from "react";
import { LayoutDashboard, BarChart2, Settings, Menu, X } from "lucide-react";
import logoImg from "../assets/images/logo/logo.jpeg";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "statistics", label: "Statistici", Icon: BarChart2 },
  { id: "settings", label: "Setări", Icon: Settings },
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
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const active = activeId === id;
        return (
          <button
            key={id}
            onClick={() => {
              onNav(id);
              onClickItem?.();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "10px 12px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontFamily: "'Inter',sans-serif",
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 2,
              transition: "all .15s",
              background: active ? "#0d9488" : "transparent",
              color: active ? "#fff" : "#475569",
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.background = "#f0fdfa";
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.background = "transparent";
            }}
          >
            <Icon size={17} strokeWidth={active ? 2.5 : 2} />
            {label}
          </button>
        );
      })}
    </>
  );
}

export default function Navigation({ page, onNav }) {
  const activeId = [
    "dashboard",
    "finance",
    "uat",
    "locality",
    "sector",
  ].includes(page)
    ? "dashboard"
    : page;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <aside
        className="cad-sidebar"
        style={{
          background: "#fff",
          borderRight: "1px solid #f1f5f9",
          height: "100vh",
          position: "sticky",
          top: 0,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: "20px 16px 16px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <Logo />
        </div>
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          <NavLinks activeId={activeId} onNav={onNav} />
        </nav>
        <div
          style={{
            padding: "14px 16px",
            borderTop: "1px solid #f1f5f9",
            fontSize: 10,
            color: "#cbd5e1",
            letterSpacing: "0.05em",
          }}
        >
          v1.0 · 2026
        </div>
      </aside>

      <div
        className="cad-topbar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "#fff",
          borderBottom: "1px solid #f1f5f9",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Logo />
        <button
          onClick={() => setMobileOpen(true)}
          className="cad-icon-btn"
          style={{ padding: 6 }}
        >
          <Menu size={22} />
        </button>
      </div>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 60,
            display: "flex",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 240,
              background: "#fff",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxShadow: "4px 0 24px rgba(0,0,0,.12)",
              animation: "slideInLeft .22s ease",
            }}
          >
            <div
              style={{
                padding: "20px 16px 12px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                className="cad-icon-btn"
              >
                <X size={18} />
              </button>
            </div>
            <nav style={{ flex: 1, padding: "12px 10px" }}>
              <NavLinks
                activeId={activeId}
                onNav={onNav}
                onClickItem={() => setMobileOpen(false)}
              />
            </nav>
            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid #f1f5f9",
                fontSize: 10,
                color: "#cbd5e1",
              }}
            >
              v1.0 · 2026
            </div>
          </div>
        </div>
      )}
    </>
  );
}
