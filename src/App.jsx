import { useState } from "react";
import { AppProvider } from "./context/AppContext.jsx";
import Navigation from "./components/Navigation.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import FinancePage from "./pages/FinancePage.jsx";
import UatPage from "./pages/UatPage.jsx";
import LocalityPage from "./pages/LocalityPage.jsx";
import SectorPage from "./pages/SectorPage.jsx";
import StatisticsPage from "./pages/StatisticsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

function AppContent() {
  const [route, setRoute] = useState({ page: "dashboard", params: {} });
  const nav = (page, params = {}) => { setRoute({ page, params }); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const renderPage = () => {
    const { page, params } = route;
    switch (page) {
      case "dashboard":  return <DashboardPage onNav={nav} />;
      case "finance":    return <FinancePage   financeId={params.financeId} onNav={nav} />;
      case "uat":        return <UatPage       financeId={params.financeId} uatId={params.uatId} onNav={nav} />;
      case "locality":   return <LocalityPage  financeId={params.financeId} uatId={params.uatId} localityId={params.localityId} onNav={nav} />;
      case "sector":     return <SectorPage    financeId={params.financeId} uatId={params.uatId} localityId={params.localityId} sectorId={params.sectorId} onNav={nav} />;
      case "statistics": return <StatisticsPage />;
      case "settings":   return <SettingsPage />;
      default:           return <DashboardPage onNav={nav} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      <Navigation page={route.page} onNav={nav} />
      <main className="cad-main" style={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
