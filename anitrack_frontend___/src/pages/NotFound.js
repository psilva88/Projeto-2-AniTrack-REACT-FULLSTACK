import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function NotFound() {
  const { theme } = useTheme();
  return (
    <div style={{
      background: theme.bg, minHeight: "calc(100vh - 64px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", textAlign: "center", padding: "40px",
      transition: "background 0.3s",
    }}>
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "20px" }}>
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <h2 style={{ color: theme.text, fontSize: "32px", fontWeight: "700", marginBottom: "10px" }}>
        404 — Página não encontrada
      </h2>
      <p style={{ color: theme.textMuted, fontSize: "15px", marginBottom: "28px" }}>
      </p>
      <Link to="/home" style={{
        background: "#7c3aed", color: "#fff", padding: "12px 28px",
        borderRadius: "8px", textDecoration: "none", fontWeight: "600",
      }}>
        Voltar para a Home
      </Link>
    </div>
  );
}

export default NotFound;
