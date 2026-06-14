import { useState } from "react";
import { LayoutDashboard, BarChart2, Settings, Menu, X, LogOut } from "lucide-react";
import logoImg from "../assets/images/logo/logo.jpeg";
import SignatureAEA from "./SignatureAEA.jsx";
import { useApp } from "../context/AppContext.jsx";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "statistics", label: "Statistici", Icon: BarChart2 },
  { id: "settings", label: "Setări", Icon: Settings },
];

function Logo({ onNav }) {
  return (
    <div
      onClick={() => onNav?.("dashboard")}
      className="flex items-center gap-2.5 cursor-pointer"
    >
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
            className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl border-none cursor-pointer font-sans text-sm font-medium mb-0.5 transition-all duration-150 ${
              active
                ? "bg-teal-600 text-white"
                : "bg-transparent text-slate-600 hover:bg-teal-50 hover:text-teal-700"
            }`}
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
  const { currentUser, logout } = useApp();
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
      <aside className="cad-sidebar">
        <div className="px-4 pt-5 pb-4 border-b border-slate-100">
          <Logo onNav={onNav} />
        </div>
        <nav className="flex-1 p-3">
          <NavLinks activeId={activeId} onNav={onNav} />
        </nav>
        <div className="px-4 py-3.5 border-t border-slate-100 flex flex-col gap-2.5">
          {currentUser && (
            <button onClick={logout}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 bg-transparent border-none cursor-pointer font-sans text-[13px] font-medium">
              <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                {currentUser.charAt(0).toUpperCase()}
              </div>
              <span className="flex-1 text-left truncate">{currentUser}</span>
              <LogOut size={14} />
            </button>
          )}
          <SignatureAEA />
        </div>
      </aside>

      <div className="cad-topbar fixed top-0 left-0 right-0 z-[50] bg-white border-b border-slate-100 px-4 py-2.5 flex items-center justify-between">
        <Logo onNav={onNav} />
        <button onClick={() => setMobileOpen(true)} className="cad-icon-btn p-1.5">
          <Menu size={22} />
        </button>
      </div>

      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/35 z-[60] flex">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-60 bg-white h-full flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.12)] animate-slide-in-left"
          >
            <div className="px-4 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
              <Logo onNav={onNav} />
              <button onClick={() => setMobileOpen(false)} className="cad-icon-btn">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 p-2.5">
              <NavLinks activeId={activeId} onNav={onNav} onClickItem={() => setMobileOpen(false)} />
            </nav>
            <div className="px-4 py-3 border-t border-slate-100 flex flex-col gap-2">
              {currentUser && (
                <button onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 bg-transparent border-none cursor-pointer font-sans text-[13px] font-medium">
                  <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                    {currentUser.charAt(0).toUpperCase()}
                  </div>
                  <span className="flex-1 text-left truncate">{currentUser}</span>
                  <LogOut size={14} />
                </button>
              )}
              <SignatureAEA />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
