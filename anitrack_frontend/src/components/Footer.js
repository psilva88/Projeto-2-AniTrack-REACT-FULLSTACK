import { useTheme } from "../context/ThemeContext";
import { useResponsive } from "../hooks/useResponsive";

// Ícones das redes/links
const GithubIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z"/></svg>;
const InstagramIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const TwitterIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const MailIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;

function Footer() {
  const { theme } = useTheme();
  const { isMobile } = useResponsive();
  const font = "'Inter', sans-serif";

  const linkStyle = {
    color: "#94a3b8",
    fontSize: "13px",
    fontFamily: font,
    textDecoration: "none",
    display: "block",
    marginBottom: "8px",
    transition: "color 0.2s",
  };

  const tituloCol = {
    color: "#e2e8f0",
    fontSize: "13px",
    fontWeight: "700",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    marginBottom: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const socialBtn = {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "rgba(124,58,237,0.12)",
    border: "1px solid rgba(124,58,237,0.25)",
    color: "#a78bfa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    transition: "all 0.2s",
  };

  return (
    <footer style={{
      background: "linear-gradient(180deg, #14122e 0%, #0d0b1f 100%)",
      borderTop: "1px solid rgba(124,58,237,0.2)",
      padding: isMobile ? "40px 24px 28px" : "48px 48px 32px",
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr 1fr",
        gap: isMobile ? "32px" : "40px",
        alignItems: "start",
      }}>

        {/* Coluna 1: Logo + descrição + redes sociais */}
        <div style={{ textAlign: isMobile ? "center" : "left" }}>
          <img src="/images/logo.png" alt="AniTrack" style={{ height: "90px", width: "auto", marginBottom: "12px" }} />
          <p style={{
            color: "#64748b",
            fontSize: "13px",
            lineHeight: "1.65",
            fontFamily: font,
            maxWidth: "300px",
            margin: isMobile ? "0 auto 18px" : "0 0 18px",
          }}>
            Seu catálogo pessoal de animes. Acompanhe episódios, marque favoritos e organize sua jornada.
          </p>
          {/* Redes sociais */}
          <div style={{ display: "flex", gap: "10px", justifyContent: isMobile ? "center" : "flex-start" }}>
            <a href="https://github.com/psilva88/Projeto-2-AniTrack-REACT-FULLSTACK" target="_blank" rel="noopener noreferrer" style={socialBtn} title="GitHub"><GithubIcon /></a>
            <a href="https://instagram.com/anitrack" target="_blank" rel="noopener noreferrer" style={socialBtn} title="Instagram"><InstagramIcon /></a>
            <a href="https://twitter.com/anitrack" target="_blank" rel="noopener noreferrer" style={socialBtn} title="Twitter / X"><TwitterIcon /></a>
            <a href="mailto:contato@anitrack.com" style={socialBtn} title="E-mail"><MailIcon /></a>
          </div>
        </div>

        {/* Coluna 2: Navegação */}
        <div style={{ textAlign: isMobile ? "center" : "left" }}>
          <p style={tituloCol}>Navegação</p>
          <a href="/home" style={linkStyle}>Home</a>
          <a href="/dashboard/minha-lista" style={linkStyle}>Minha Lista</a>
          <a href="/dashboard/perfil" style={linkStyle}>Perfil</a>
        </div>

        {/* Coluna 3: Sobre */}
        <div style={{ textAlign: isMobile ? "center" : "left" }}>
          <p style={tituloCol}>Sobre</p>
          <a href="https://jikan.moe" target="_blank" rel="noopener noreferrer" style={linkStyle}>API MyAnimeList</a>
          <a href="https://unifacisa.edu.br" target="_blank" rel="noopener noreferrer" style={linkStyle}>UNIFACISA — 2026</a>
        </div>
      </div>

      {/* Linha de baixo */}
      <div style={{
        maxWidth: "1100px",
        margin: "32px auto 0",
        paddingTop: "20px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <p style={{ color: "#475569", fontSize: "12px", fontFamily: font }}>
          © 2026 AniTrack. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
