import { useTheme } from "../context/ThemeContext";
import { useAnime } from "../context/AnimeContext";
import { useAuth } from "../context/AuthContext";
import { useResponsive } from "../hooks/useResponsive";

const generos = [{ g: "Ação", p: 70 }, { g: "Aventura", p: 55 }, { g: "Sobrenatural", p: 45 }, { g: "Drama", p: 35 }, { g: "Comédia", p: 20 }];

const TvIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>;
const PlayIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>;
const CheckIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const StarIconStat = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

// Gerar iniciais do nome
function getInitials(nome) {
  if (!nome) return "?";
  const parts = nome.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
}

function Perfil() {
  const { theme } = useTheme();
  const { stats, historico } = useAnime();
  const { usuario } = useAuth(); // dados reais do usuário logado
  const { isMobile, isTablet } = useResponsive();

  const font = "'Inter', sans-serif";
  const fontDisplay = "'Plus Jakarta Sans', sans-serif";

  // Dados do usuário logado
  const nome = usuario?.nome || "Visitante";
  const email = usuario?.email || "—";
  const initials = getInitials(nome);
  const dataEntrada = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const statCards = [
    { label: "Animes na lista", valor: stats.total, Icon: TvIcon },
    { label: "Eps assistidos", valor: stats.episodiosAssistidos, Icon: PlayIcon },
    { label: "Finalizados", valor: stats.finalizados, Icon: CheckIcon },
    { label: "Favoritos", valor: stats.favoritos, Icon: StarIconStat },
  ];

  const card = { background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: isMobile ? "18px 16px" : "24px" };

  return (
    <div>
      <h2 style={{ color: theme.text, fontSize: isMobile ? "20px" : "22px", fontWeight: "700", fontFamily: fontDisplay, marginBottom: "4px" }}>Perfil</h2>
      <p style={{ color: theme.textMuted, fontSize: "14px", fontFamily: font, marginBottom: "20px" }}>Suas informações e estatísticas em tempo real.</p>

      {/* Stats em tempo real */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: "12px", marginBottom: "18px" }}>
        {statCards.map(({ label, valor, Icon }) => (
          <div key={label} style={{ ...card, textAlign: "center", padding: "18px" }}>
            <Icon />
            <span style={{ color: "#7c3aed", fontSize: "26px", fontWeight: "700", display: "block", marginTop: "8px", fontFamily: fontDisplay }}>{valor}</span>
            <p style={{ color: theme.textMuted, fontSize: "12px", marginTop: "4px", fontFamily: font }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile || isTablet ? "1fr" : "1fr 1fr", gap: "16px", marginBottom: "18px" }}>
        {/* Informações do usuário */}
        <div style={card}>
          <p style={{ color: theme.text, fontSize: "15px", fontWeight: "600", fontFamily: font, marginBottom: "16px" }}>Informações do Usuário</p>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#7c3aed", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "17px", flexShrink: 0 }}>
              {initials}
            </div>
            <div>
              <p style={{ color: theme.text, fontWeight: "700", fontSize: "16px", fontFamily: fontDisplay }}>{nome}</p>
              <p style={{ color: theme.textMuted, fontSize: "13px", marginTop: "2px", fontFamily: font }}>{email}</p>
              <span style={{ display: "inline-block", background: theme.success, color: theme.successText, padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", marginTop: "6px" }}>
                {usuario?.email ? "Conta Ativa" : "Visitante"}
              </span>
            </div>
          </div>
          {[
            ["Membro desde", dataEntrada],
            ["Plano", "Gratuito"],
            ["Idioma", "Português (BR)"],
          ].map(([k, v], i, arr) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: i < arr.length - 1 ? `1px solid ${theme.border}` : "none" }}>
              <span style={{ color: theme.textMuted, fontSize: "13px", fontFamily: font }}>{k}</span>
              <span style={{ color: theme.text, fontSize: "13px", fontWeight: "500", fontFamily: font }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Gêneros preferidos (Placeholder) */}
        <div style={card}>
          <p style={{ color: theme.text, fontSize: "15px", fontWeight: "600", fontFamily: font, marginBottom: "16px" }}>Gêneros Preferidos</p>
          {generos.map(({ g, p }) => (
            <div key={g} style={{ marginBottom: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ color: theme.text, fontSize: "13px", fontFamily: font }}>{g}</span>
                <span style={{ color: theme.textMuted, fontSize: "12px", fontFamily: font }}>{p}%</span>
              </div>
              <div style={{ height: "5px", background: theme.border, borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${p}%`, background: "#7c3aed", borderRadius: "3px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Histórico em tempo real */}
      <div style={card}>
        <p style={{ color: theme.text, fontSize: "15px", fontWeight: "600", fontFamily: font, marginBottom: "14px" }}>
          Histórico de Atividade
          <span style={{ color: theme.textMuted, fontWeight: "400", fontSize: "12px", marginLeft: "8px" }}>(tempo real)</span>
        </p>
        {historico.length === 0 ? (
          <p style={{ color: theme.textMuted, fontSize: "14px", textAlign: "center", padding: "20px 0" }}>Nenhuma atividade registrada.</p>
        ) : historico.map((h) => (
          <div key={h.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${theme.border}`, flexWrap: isMobile ? "wrap" : "nowrap", gap: "4px" }}>
            <div>
              <span style={{ color: theme.textMuted, fontSize: "12px", fontFamily: font }}>{h.acao} · </span>
              <span style={{ color: theme.text, fontSize: "13px", fontWeight: "600", fontFamily: fontDisplay }}>{h.anime}</span>
            </div>
            <span style={{ color: theme.textMuted, fontSize: "12px", fontFamily: font, whiteSpace: "nowrap" }}>{h.data}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Perfil;
