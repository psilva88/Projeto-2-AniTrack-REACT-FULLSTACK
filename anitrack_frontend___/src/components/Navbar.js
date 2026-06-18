import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useResponsive } from "../hooks/useResponsive";

const SunIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const MoonIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const HomeIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const DashIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const LogoutIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const AddUserIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>;

function getAvatar(nome) {
  if (!nome || nome === "Visitante") return { initials: "V", color: "#475569" };
  const parts = nome.trim().split(" ");
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
  const colors = ["#7c3aed", "#0369a1", "#065f46", "#b45309", "#9d174d", "#1e40af"];
  return { initials, color: colors[nome.charCodeAt(0) % colors.length] };
}

function Navbar() {
  const { theme, darkMode, toggleTheme } = useTheme();
  const { usuario, contas, logout, trocarConta } = useAuth();
  const { isMobile } = useResponsive();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const font = "'Inter', sans-serif";

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");
  const navHeight = isMobile ? "64px" : "92px";
  const avatar = getAvatar(usuario?.nome);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    setDropdownOpen(false);
    logout();
    navigate("/");
  }

  function handleAdicionarConta() {
    setDropdownOpen(false);
    navigate("/");
  }

  function handleTrocarConta(conta) {
    setDropdownOpen(false);
    trocarConta(conta);
  }

  const linkStyle = (active) => ({
    color: active ? (darkMode ? "#c4b5fd" : "#7c3aed") : (darkMode ? "#cbd5e1" : "#475569"),
    textDecoration: "none", padding: "8px 14px", borderRadius: "8px",
    fontSize: "14px", fontWeight: active ? "600" : "500", fontFamily: font,
    background: active ? (darkMode ? "rgba(167,139,250,0.18)" : "rgba(124,58,237,0.12)") : "transparent",
    display: "flex", alignItems: "center", gap: "7px",
  });

  // Dropdown compartilhado desktop + mobile
  const Dropdown = () => (
    <div style={{
      position: "absolute",
      top: isMobile ? "calc(100% + 8px)" : "calc(100% + 10px)",
      right: 0,
      minWidth: "210px",
      maxWidth: isMobile ? "calc(100vw - 32px)" : "240px",
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderRadius: "12px",
      padding: "8px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
      zIndex: 500,
    }}>

      {/* Informações do usuário */}
      <div style={{ padding: "10px 12px 12px", borderBottom: `1px solid ${theme.border}`, marginBottom: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: avatar.color, color: "#fff", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {avatar.initials}
          </div>
          <div style={{ overflow: "hidden" }}>
            <p style={{ color: theme.text, fontSize: "13px", fontWeight: "600", fontFamily: font, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{usuario?.nome || "Visitante"}</p>
            {usuario?.email && <p style={{ color: theme.textMuted, fontSize: "11px", fontFamily: font, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{usuario.email}</p>}
          </div>
        </div>
      </div>

      {/* Outras contas */}
      {contas.filter((c) => c.email !== usuario?.email).map((conta) => {
        const av = getAvatar(conta.nome);
        return (
          <button key={conta.email} onClick={() => handleTrocarConta(conta)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "8px", background: "none", border: "none", cursor: "pointer" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: av.color, color: "#fff", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{av.initials}</div>
            <div style={{ overflow: "hidden", textAlign: "left" }}>
              <p style={{ color: theme.text, fontSize: "13px", fontFamily: font, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{conta.nome}</p>
            </div>
          </button>
        );
      })}

      <div style={{ borderTop: `1px solid ${theme.border}`, marginTop: "6px", paddingTop: "6px" }}>
        <button onClick={handleAdicionarConta} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "8px", background: "none", border: "none", cursor: "pointer", color: theme.text, fontSize: "13px", fontFamily: font }}>
          <AddUserIcon /> Adicionar outra conta
        </button>
        <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "8px", background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "13px", fontFamily: font }}>
          <LogoutIcon /> Sair
        </button>
      </div>
    </div>
  );

  return (
    <nav style={{
      background: darkMode
        ? "linear-gradient(90deg, #2a2150 0%, #362a6b 50%, #2a2150 100%)"
        : "linear-gradient(90deg, #ffffff 0%, #f5f3ff 50%, #ffffff 100%)",
      padding: isMobile ? "0 16px" : "0 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: navHeight,
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: darkMode ? "0 2px 16px rgba(124,58,237,0.45)" : "0 2px 14px rgba(124,58,237,0.18)",
      borderBottom: darkMode ? "2px solid #a78bfa" : "2px solid #7c3aed",
    }}>

      {/* Logo */}
      <Link to="/home" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <img src="/images/logo.png" alt="AniTrack" style={{ height: isMobile ? "50px" : "84px", width: "auto" }} />
      </Link>

      {/* Desktop: links + toggle + avatar */}
      {!isMobile && (
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <Link to="/home" style={linkStyle(location.pathname === "/home")}><HomeIcon /> Home</Link>
          <Link to="/dashboard/minha-lista" style={linkStyle(isActive("/dashboard"))}><DashIcon /> Dashboard</Link>
          <button onClick={toggleTheme} style={{ background: darkMode ? "rgba(167,139,250,0.18)" : "rgba(124,58,237,0.1)", border: darkMode ? "1px solid rgba(167,139,250,0.4)" : "1px solid rgba(124,58,237,0.3)", color: darkMode ? "#c4b5fd" : "#7c3aed", padding: "8px 14px", borderRadius: "20px", cursor: "pointer", fontSize: "13px", fontWeight: "600", fontFamily: font, display: "flex", alignItems: "center", gap: "6px", marginLeft: "8px" }}>
            {darkMode ? <SunIcon /> : <MoonIcon />} {darkMode ? "Light" : "Dark"}
          </button>

          {/* Avatar com dropdown */}
          <div ref={dropdownRef} style={{ position: "relative", marginLeft: "8px" }}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{ width: "38px", height: "38px", borderRadius: "50%", background: avatar.color, border: "2px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "13px", fontWeight: "700", fontFamily: font, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {avatar.initials}
            </button>
            {dropdownOpen && <Dropdown />}
          </div>
        </div>
      )}

      {/* Mobile: só avatar */}
      {isMobile && (
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ width: "38px", height: "38px", borderRadius: "50%", background: avatar.color, border: "2px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "14px", fontWeight: "700", fontFamily: font, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {avatar.initials}
          </button>
          {dropdownOpen && <Dropdown />}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
