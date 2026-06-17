import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const DashIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const SunIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

function BottomNav() {
  const { theme, darkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const font = "'Inter', sans-serif";

  const itemStyle = (active) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    padding: "8px 20px",
    textDecoration: "none",
    color: active ? "#a78bfa" : "#475569",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    flex: 1,
    transition: "color 0.2s",
  });

  const labelStyle = (active) => ({
    fontSize: "10px",
    fontWeight: active ? "600" : "400",
    fontFamily: font,
    color: active ? "#a78bfa" : "#475569",
  });

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      height: "64px",
      background: theme.bgNav,
      borderTop: `1px solid rgba(255,255,255,0.07)`,
      display: "flex",
      alignItems: "center",
      zIndex: 200,
      boxShadow: "0 -4px 20px rgba(0,0,0,0.3)",
    }}>
      <Link to="/home" style={itemStyle(location.pathname === "/home")}>
        <HomeIcon />
        <span style={labelStyle(location.pathname === "/home")}>Home</span>
      </Link>

      <Link to="/dashboard/minha-lista" style={itemStyle(isActive("/dashboard"))}>
        <DashIcon />
        <span style={labelStyle(isActive("/dashboard"))}>Dashboard</span>
      </Link>

      <button onClick={toggleTheme} style={itemStyle(false)}>
        {darkMode ? <SunIcon /> : <MoonIcon />}
        <span style={labelStyle(false)}>{darkMode ? "Light" : "Dark"}</span>
      </button>
    </nav>
  );
}

export default BottomNav;
