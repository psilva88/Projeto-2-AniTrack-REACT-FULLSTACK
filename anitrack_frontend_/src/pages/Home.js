import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useResponsive } from "../hooks/useResponsive";
import { useAnime } from "../context/AnimeContext";
import { useAuth } from "../context/AuthContext";
import { jikanService } from "../services/api";

// Animes fixos de reserva (caso a API do Jikan falhe)
const animesReserva = [
  { nome: "Attack on Titan", generos: "Ação, Drama", totalEps: 87, nota: 9.0, capa: "/images/attack-on-titan.jpg" },
  { nome: "Demon Slayer", generos: "Ação, Sobrenatural", totalEps: 44, nota: 8.5, capa: "/images/demon-slayer.jpg" },
  { nome: "Fullmetal Alchemist", generos: "Aventura, Fantasia", totalEps: 64, nota: 9.1, capa: "/images/fullmetal-alchemist.jpg" },
  { nome: "Bleach", generos: "Ação, Sobrenatural", totalEps: 366, nota: 8.2, capa: "/images/bleach.jpg" },
  { nome: "One Piece", generos: "Aventura, Comédia", totalEps: 1100, nota: 8.7, capa: "/images/one-piece.jpg" },
  { nome: "Jujutsu Kaisen", generos: "Ação, Sobrenatural", totalEps: 48, nota: 8.6, capa: "/images/jujutsu-kaisen.jpg" },
  { nome: "Death Note", generos: "Suspense, Sobrenatural", totalEps: 37, nota: 8.6, capa: "/images/attack-on-titan.jpg" },
  { nome: "One Punch Man", generos: "Ação, Comédia", totalEps: 12, nota: 8.5, capa: "/images/demon-slayer.jpg" },
  { nome: "Hunter x Hunter", generos: "Aventura, Fantasia", totalEps: 148, nota: 9.0, capa: "/images/fullmetal-alchemist.jpg" },
  { nome: "Naruto", generos: "Ação, Aventura", totalEps: 220, nota: 8.0, capa: "/images/bleach.jpg" },
  { nome: "Sword Art Online", generos: "Ação, Fantasia", totalEps: 25, nota: 7.2, capa: "/images/one-piece.jpg" },
  { nome: "Tokyo Ghoul", generos: "Ação, Sobrenatural", totalEps: 12, nota: 7.8, capa: "/images/jujutsu-kaisen.jpg" },
];

const StarIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const TvIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>;
const ArrowIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const PlusIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;

function Home() {
  const { theme } = useTheme();
  const { isMobile, isTablet } = useResponsive();
  const { addAnime } = useAnime();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const font = "'Inter', sans-serif";
  const fontDisplay = "'Plus Jakarta Sans', sans-serif";

  const [animes, setAnimes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [adicionandoIdx, setAdicionandoIdx] = useState(null);
  // Capas para o marquee do hero: top animes quando chegam, senão a reserva (capas locais)
  const heroPosters = animes.length ? animes : animesReserva;

  // Busca os top animes ao carregar a Home
  useEffect(() => {
    async function carregar() {
      try {
        const dados = await jikanService.topAnimes(12);
        setAnimes(dados);
      } catch (err) {
        console.error("Jikan indisponível, usando reserva:", err.message);
        setAnimes(animesReserva);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  // Adiciona o anime à lista do usuário e redireciona
  async function adicionarNaLista(anime, idx) {
    if (!usuario) {
      navigate("/");
      return;
    }
    setAdicionandoIdx(idx);
    try {
      await addAnime({
        nome: anime.nome,
        totalEps: anime.totalEps || 12,
        assistidos: 0,
        status: "Planejando",
        favorito: false,
        capa: anime.capa,
      });
      navigate("/dashboard/minha-lista");
    } catch (err) {
      alert("Erro ao adicionar: " + err.message);
    } finally {
      setAdicionandoIdx(null);
    }
  }

  const heroPad = isMobile ? "60px 20px 60px" : isTablet ? "80px 32px 80px" : "100px 48px 96px";
  const h1Size = isMobile ? "36px" : isTablet ? "46px" : "58px";
  const gridCols = isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)";
  const secPad = isMobile ? "36px 20px" : isTablet ? "48px 32px" : "64px 48px";

  const btn = {
    display: "inline-flex", alignItems: "center", gap: "8px",
    background: "#7c3aed", color: "#fff", padding: isMobile ? "12px 22px" : "13px 28px",
    borderRadius: "10px", textDecoration: "none", fontWeight: "600",
    fontSize: isMobile ? "14px" : "15px", fontFamily: font,
  };

  const btnGhost = {
    display: "inline-flex", alignItems: "center", gap: "8px",
    background: "transparent", color: "#cbd5e1", padding: isMobile ? "12px 22px" : "13px 28px",
    borderRadius: "10px", textDecoration: "none", fontWeight: "600",
    fontSize: isMobile ? "14px" : "15px", fontFamily: font,
    border: "1px solid rgba(255,255,255,0.14)",
  };

  return (
    <div style={{ background: theme.bg, minHeight: `calc(100vh - ${isMobile ? "68px" : "92px"})`, transition: "background 0.3s", fontFamily: font }}>
      <style>{`
        @keyframes hero-shimmer { 0% { background-position: 0% center; } 100% { background-position: -200% center; } }
        @keyframes hero-fade-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes hero-marquee-up { from { transform: translateY(0); } to { transform: translateY(-50%); } }
        @keyframes hero-marquee-down { from { transform: translateY(-50%); } to { transform: translateY(0); } }
        @keyframes hero-marquee-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .hero-anim { animation: hero-fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .hero-anim, .hero-shimmer, .hero-track { animation: none !important; }
        }
      `}</style>

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #080814 0%, #0d1628 45%, #0a1929 100%)", padding: heroPad, position: "relative", overflow: "hidden" }}>
        {/* Grid sutil de fundo */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.03, backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        {/* Glow central */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />
        {/* Glows laterais */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 50% 40% at 8% 88%, rgba(99,102,241,0.1) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 45% 38% at 94% 12%, rgba(167,139,250,0.09) 0%, transparent 65%)" }} />

        {/* Conteúdo: 2 colunas no desktop, empilhado no mobile */}
        <div style={{ position: "relative", maxWidth: "1140px", margin: "0 auto", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", justifyContent: "space-between", gap: isMobile ? "44px" : "40px", textAlign: isMobile ? "center" : "left" }}>

          {/* Coluna de texto */}
          <div style={{ flex: isMobile ? "none" : "1 1 0", maxWidth: isMobile ? "100%" : "560px" }}>
            <h1 className="hero-anim" style={{ color: "#f1f5f9", fontSize: h1Size, fontWeight: "800", lineHeight: "1.05", marginBottom: "18px", letterSpacing: isMobile ? "-0.5px" : "-1.8px", fontFamily: fontDisplay }}>
              Sua jornada<br />
              <span className="hero-shimmer" style={{ background: "linear-gradient(110deg, #a78bfa 0%, #7c3aed 30%, #6366f1 50%, #7c3aed 70%, #a78bfa 100%)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "hero-shimmer 5s linear infinite" }}>organizada</span>
            </h1>

            <p className="hero-anim" style={{ color: "#94a3b8", fontSize: isMobile ? "15px" : "18px", maxWidth: "480px", margin: isMobile ? "0 auto 30px" : "0 0 30px", lineHeight: "1.7", animationDelay: "0.08s" }}>
              Acompanhe episódios, descubra novos títulos e nunca mais perca o fio das suas séries favoritas.
            </p>

            <div className="hero-anim" style={{ display: "flex", flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start", gap: "12px", animationDelay: "0.16s" }}>
              <Link to="/dashboard/minha-lista" style={btn}> Acessar Minha Lista <ArrowIcon /> </Link>
              <a href="#catalogo" style={btnGhost}> Ver Catálogo </a>
            </div>

            {/* Social proof */}
            <div className="hero-anim" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: isMobile ? "center" : "flex-start", gap: isMobile ? "10px" : "16px", marginTop: "30px", animationDelay: "0.24s" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {[["#7c3aed", "A"], ["#6366f1", "K"], ["#a78bfa", "M"], ["#4f46e5", "R"]].map(([bg, ch], i) => (
                  <span key={ch} style={{ width: "30px", height: "30px", borderRadius: "50%", background: bg, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", fontFamily: fontDisplay, border: "2px solid #0a1422", marginLeft: i === 0 ? 0 : "-10px" }}>{ch}</span>
                ))}
              </div>
              <span style={{ color: "#94a3b8", fontSize: isMobile ? "12px" : "13px", fontFamily: font }}>
                <strong style={{ color: "#cbd5e1" }}>+500 otakus</strong> já usam o AniTrack
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#f59e0b", fontSize: isMobile ? "12px" : "13px", fontWeight: "600", fontFamily: font }}>
                <StarIcon /> 4.9
              </span>
            </div>
          </div>

          {/* Coluna visual: capas de animes passando (marquee) */}
          {isMobile ? (
            /* Mobile: faixa horizontal full-bleed */
            <div className="hero-anim" style={{ animationDelay: "0.2s", width: "auto", margin: "4px -20px 0", overflow: "hidden", maskImage: "linear-gradient(90deg, transparent 0%, #000 9%, #000 91%, transparent 100%)", WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 9%, #000 91%, transparent 100%)" }}>
              <div className="hero-track" style={{ display: "flex", width: "max-content", animation: "hero-marquee-left 34s linear infinite" }}>
                {[...heroPosters, ...heroPosters].map((p, i) => (
                  <div key={i} style={{ width: "108px", height: "154px", flexShrink: 0, marginRight: "14px", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 22px rgba(0,0,0,0.4)", background: "#0d0d1e" }}>
                    <img src={p.capa} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.opacity = "0"; }} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Desktop/tablet: colunas verticais rolando em direções alternadas */
            <div className="hero-anim" style={{ flex: "0 0 auto", display: "flex", gap: "16px", height: "400px", animationDelay: "0.2s", maskImage: "linear-gradient(180deg, transparent 0%, #000 15%, #000 85%, transparent 100%)", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 15%, #000 85%, transparent 100%)" }}>
              {[
                { anim: "hero-marquee-up", dur: "32s" },
                { anim: "hero-marquee-down", dur: "40s" },
                { anim: "hero-marquee-up", dur: "36s" },
              ].map((cfg, c) => {
                const col = heroPosters.filter((_, i) => i % 3 === c);
                return (
                  <div key={c} style={{ width: isTablet ? "104px" : "122px", overflow: "hidden" }}>
                    <div className="hero-track" style={{ display: "flex", flexDirection: "column", animation: `${cfg.anim} ${cfg.dur} linear infinite` }}>
                      {[...col, ...col].map((p, i) => (
                        <div key={i} style={{ width: "100%", aspectRatio: "2 / 3", flexShrink: 0, marginBottom: "16px", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 10px 28px rgba(0,0,0,0.4)", background: "#0d0d1e" }}>
                          <img src={p.capa} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.opacity = "0"; }} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Grid de populares */}
      <div id="catalogo" style={{ padding: secPad, maxWidth: "1120px", margin: "0 auto", scrollMarginTop: isMobile ? "68px" : "92px" }}>
        <h2 style={{ color: theme.text, fontSize: isMobile ? "22px" : "28px", fontWeight: "700", fontFamily: fontDisplay, letterSpacing: "-0.5px", marginBottom: "6px" }}>Destaques do Catálogo</h2>
        <p style={{ color: theme.textMuted, fontSize: "14px", marginBottom: "28px" }}>Os títulos mais populares entre os usuários do AniTrack</p>

        {carregando ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: theme.textMuted }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></path></svg>
            <p style={{ marginTop: "12px", fontSize: "14px" }}>Carregando animes populares...</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: "16px" }}>
            {animes.map((a, idx) => (
              <div
                key={idx}
                style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: "16px", overflow: "hidden", transition: "transform 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.querySelector(".add-overlay").style.opacity = "1"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.querySelector(".add-overlay").style.opacity = "0"; }}
              >
                {/* Imagem horizontal */}
                <div style={{ position: "relative", height: isMobile ? "180px" : "200px", overflow: "hidden", background: "#0d0d1e" }}>
                  <img src={a.capa} alt={a.nome} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(to top, rgba(10,10,20,0.9), transparent)" }} />

                  {/* Overlay de adicionar (aparece no hover) */}
                  <div
                    className="add-overlay"
                    style={{ position: "absolute", inset: 0, background: "rgba(124,58,237,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", opacity: 0, transition: "opacity 0.2s", cursor: "pointer" }}
                    onClick={() => adicionarNaLista(a, idx)}
                  >
                    <div style={{ background: "#fff", borderRadius: "50%", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", color: "#7c3aed" }}>
                      <PlusIcon />
                    </div>
                    <span style={{ color: "#fff", fontSize: "13px", fontWeight: "600", fontFamily: font }}>
                      {adicionandoIdx === idx ? "Adicionando..." : "Adicionar à lista"}
                    </span>
                  </div>
                </div>
                <div style={{ padding: "16px" }}>
                  <p style={{ color: theme.text, fontWeight: "700", fontSize: "15px", fontFamily: fontDisplay, marginBottom: "3px", lineHeight: "1.3" }}>{a.nome}</p>
                  {a.generos && <p style={{ color: theme.textMuted, fontSize: "12px", marginBottom: "10px" }}>{a.generos}</p>}
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", color: theme.textMuted, fontSize: "12px", marginBottom: "10px" }}><TvIcon /> {a.totalEps || "?"} episódios</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: `1px solid ${theme.border}` }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "#f59e0b", fontSize: "13px", fontWeight: "600" }}><StarIcon /> {a.nota || "—"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "20px", padding: isMobile ? "36px 24px" : "56px 40px", textAlign: "center", marginTop: "32px" }}>
          <p style={{ color: theme.text, fontSize: isMobile ? "20px" : "26px", fontWeight: "700", fontFamily: fontDisplay, marginBottom: "10px" }}>Pronto para organizar sua lista?</p>
          <p style={{ color: theme.textMuted, fontSize: "14px", marginBottom: "24px" }}>Acesse o dashboard e comece a adicionar seus animes favoritos agora mesmo.</p>
          <Link to="/dashboard/minha-lista" style={btn}>Ir para Minha Lista <ArrowIcon /></Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
