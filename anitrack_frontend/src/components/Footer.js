import { useTheme } from "../context/ThemeContext";

function Footer() {
  const { theme } = useTheme();
  return (
    <footer style={{
      background: theme.bgNav,
      borderTop: "1px solid rgba(255,255,255,0.05)",
      padding: "40px 24px 28px",
    }}>
      <div style={{
        maxWidth: "400px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "12px",
      }}>
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: "800",
          fontSize: "20px",
          color: "#a78bfa",
          letterSpacing: "-0.3px",
        }}>
          AniTrack
        </span>

        <p style={{
          color: "#475569",
          fontSize: "13px",
          lineHeight: "1.65",
          maxWidth: "300px",
          fontFamily: "'Inter', sans-serif",
        }}>
          Seu catálogo pessoal de animes. Acompanhe episódios,
          marque favoritos e organize sua jornada.
        </p>

        <div style={{ width: "28px", height: "1px", background: "rgba(124,58,237,0.25)" }} />

        <p style={{
          color: "#334155",
          fontSize: "12px",
          fontFamily: "'Inter', sans-serif",
        }}>
          © 2026 AniTrack
        </p>
      </div>
    </footer>
  );
}

export default Footer;
