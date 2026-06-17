import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useResponsive } from "../hooks/useResponsive";

const ListIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const UserIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

const menuItems = [
  { to: "/dashboard/minha-lista", icon: <ListIcon />, label: "Minha Lista" },
  { to: "/dashboard/perfil", icon: <UserIcon />, label: "Perfil" },
];

function Sidebar() {
  const { theme } = useTheme();
  const { isMobile } = useResponsive();

  const linkStyle = ({ isActive }) => ({
    display: "flex", alignItems: "center", gap: "10px",
    padding: isMobile ? "12px 20px" : "10px 14px",
    borderRadius: isMobile ? "0" : "8px",
    textDecoration: "none", fontSize: "14px",
    fontWeight: isActive ? "600" : "400",
    fontFamily: "'Inter', sans-serif",
    color: isActive ? "#a78bfa" : "#64748b",
    background: isActive ? (isMobile ? "transparent" : "rgba(124,58,237,0.18)") : "transparent",
    borderLeft: isActive ? "3px solid #7c3aed" : "3px solid transparent",
    borderBottom: isMobile ? `1px solid rgba(255,255,255,0.04)` : "none",
    flex: isMobile ? 1 : "none",
    justifyContent: isMobile ? "center" : "flex-start",
    transition: "all 0.2s",
  });

  // Mobile: top tab bar
  if (isMobile) {
    return (
      <nav style={{ background: theme.bgSidebar, borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex" }}>
        {menuItems.map((item) => (
          <NavLink key={item.to} to={item.to} style={linkStyle}>
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    );
  }

  // Desktop: left sidebar
  return (
    <aside style={{
      width: "220px", minWidth: "220px",
      background: theme.bgSidebar,
      minHeight: "calc(100vh - 92px)",
      padding: "24px 12px",
      display: "flex", flexDirection: "column", gap: "4px",
      borderRight: "1px solid rgba(255,255,255,0.04)",
    }}>
      <p style={{ color: "#475569", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 12px", marginBottom: "10px", fontFamily: "'Inter', sans-serif" }}>
        Menu
      </p>
      {menuItems.map((item) => (
        <NavLink key={item.to} to={item.to} style={linkStyle}>
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </aside>
  );
}

export default Sidebar;
