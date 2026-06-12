import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useResponsive } from "../hooks/useResponsive";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const { theme } = useTheme();
  const { isMobile } = useResponsive();

  return (
    <div style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      background: theme.bg,
      minHeight: `calc(100vh - ${isMobile ? "68px" : "92px"})`,
      transition: "background 0.3s",
    }}>
      <Sidebar />
      <main style={{ flex: 1, padding: isMobile ? "20px 16px" : "32px", overflow: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
