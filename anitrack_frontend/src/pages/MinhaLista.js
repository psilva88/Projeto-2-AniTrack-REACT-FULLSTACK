import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAnime } from "../context/AnimeContext";
import { useResponsive } from "../hooks/useResponsive";
import { jikanService } from "../services/api";

const FILTROS = [
  { key: "Todos", label: "Todos" },
  { key: "Planejando", label: "Planejando" },
  { key: "Assistindo", label: "Assistindo" },
  { key: "Pausado", label: "Pausado" },
  { key: "Finalizado", label: "Finalizado" },
  { key: "Favoritos", label: "Favoritos" },
];

// Ícones
const StarIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"} stroke={filled ? "#f59e0b" : "#475569"} strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const XSmallIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const ListIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const GridIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const ImgIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

// Modal de edição
function EditModal({ anime, onSave, onCancel, theme, font, fontDisplay }) {
  const [form, setForm] = useState({
    nome: anime.nome,
    totalEps: String(anime.totalEps),
    assistidos: String(anime.assistidos),
    status: anime.status,
    capa: anime.capa || "",
  });
  const [erros, setErros] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (erros[name]) setErros((p) => ({ ...p, [name]: "" }));
  }

  function validar() {
    const e = {};
    if (!form.nome.trim()) e.nome = "Nome obrigatório.";
    if (!form.totalEps || Number(form.totalEps) <= 0) e.totalEps = "Valor inválido.";
    if (form.assistidos === "" || Number(form.assistidos) < 0) e.assistidos = "Valor inválido.";
    if (Number(form.assistidos) > Number(form.totalEps)) e.assistidos = "Maior que o total.";
    return e;
  }

  function handleSave() {
    const novosErros = validar();
    if (Object.keys(novosErros).length > 0) { setErros(novosErros); return; }
    onSave({
      nome: form.nome.trim(),
      totalEps: Number(form.totalEps),
      assistidos: Number(form.assistidos),
      status: form.status,
      capa: form.capa.trim(),
    });
  }

  const input = (hasError) => ({
    width: "100%", padding: "9px 12px", borderRadius: "8px",
    border: `1.5px solid ${hasError ? "#ef4444" : theme.inputBorder}`,
    background: theme.inputBg, color: theme.text,
    fontSize: "14px", fontFamily: font, outline: "none", boxSizing: "border-box",
  });
  const lbl = { color: theme.textMuted, fontSize: "11px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px", display: "block", fontFamily: font };

  return (
    // Overlay
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
      onClick={onCancel}
    >
      {/* Card do modal */}
      <div
        style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "480px", position: "relative" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ color: theme.text, fontSize: "17px", fontWeight: "700", fontFamily: fontDisplay }}>Editar anime</h3>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: theme.textMuted, display: "flex", padding: "2px" }}>
            <XSmallIcon />
          </button>
        </div>

        {/* Preview da capa */}
        {form.capa && (
          <div style={{ marginBottom: "16px", display: "flex", gap: "12px", alignItems: "center" }}>
            <img src={form.capa} alt="preview" style={{ width: "50px", height: "70px", borderRadius: "6px", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
            <span style={{ color: theme.textMuted, fontSize: "12px", fontFamily: font }}>Preview da capa atual</span>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Nome */}
          <div>
            <label style={lbl}>Nome do anime</label>
            <input style={input(!!erros.nome)} name="nome" value={form.nome} onChange={handleChange} />
            {erros.nome && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{erros.nome}</p>}
          </div>

          {/* Episódios */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={lbl}>Total de eps</label>
              <input style={input(!!erros.totalEps)} name="totalEps" type="number" min="1" value={form.totalEps} onChange={handleChange} />
              {erros.totalEps && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{erros.totalEps}</p>}
            </div>
            <div>
              <label style={lbl}>Assistidos</label>
              <input style={input(!!erros.assistidos)} name="assistidos" type="number" min="0" value={form.assistidos} onChange={handleChange} />
              {erros.assistidos && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{erros.assistidos}</p>}
            </div>
          </div>

          {/* Status */}
          <div>
            <label style={lbl}>Status</label>
            <select style={input(false)} name="status" value={form.status} onChange={handleChange}>
              <option value="Planejando">Planejando</option>
              <option value="Assistindo">Assistindo</option>
              <option value="Pausado">Pausado</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>

          {/* URL da capa */}
          <div>
            <label style={lbl}>URL da capa</label>
            <input style={input(false)} name="capa" value={form.capa} onChange={handleChange} placeholder="https://..." />
          </div>
        </div>

        {/* Botões */}
        <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "11px", borderRadius: "8px", border: `1px solid ${theme.border}`, background: "transparent", color: theme.text, fontSize: "14px", fontWeight: "500", fontFamily: font, cursor: "pointer" }}>
            Cancelar
          </button>
          <button onClick={handleSave} style={{ flex: 1, padding: "11px", borderRadius: "8px", border: "none", background: "#7c3aed", color: "#fff", fontSize: "14px", fontWeight: "600", fontFamily: font, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <CheckIcon /> Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente principal
function MinhaLista() {
  const { theme } = useTheme();
  const { animes, addAnime, removeAnime, toggleFavorito, updateEpisodios, updateAnime, carregando } = useAnime();
  const { isMobile } = useResponsive();

  const [filtro, setFiltro] = useState("Todos");
  const [visualizacao, setVisualizacao] = useState("lista");
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ nome: "", totalEps: "", assistidos: "", status: "Planejando", capa: "" });
  const [erros, setErros] = useState({});

  // Busca e ordenação na própria lista
  const [buscaLista, setBuscaLista] = useState("");
  const [ordenacao, setOrdenacao] = useState("recentes");

  // Confirmação de remoção
  const [confirmandoRemocao, setConfirmandoRemocao] = useState(null);

  // Busca no MyAnimeList (Jikan) — EXTRA
  const [buscaMal, setBuscaMal] = useState("");
  const [resultadosMal, setResultadosMal] = useState([]);
  const [buscandoMal, setBuscandoMal] = useState(false);
  const [erroMal, setErroMal] = useState("");


  async function buscarNoMal() {
    if (!buscaMal.trim()) return;
    setBuscandoMal(true);
    setErroMal("");
    setResultadosMal([]);
    try {
      const dados = await jikanService.buscar(buscaMal);
      if (dados.length === 0) setErroMal("Nenhum anime encontrado.");
      setResultadosMal(dados);
    } catch (err) {
      setErroMal("Erro ao buscar. Tente novamente.");
    } finally {
      setBuscandoMal(false);
    }
  }

  // Ao clicar num resultado, preenche o formulário automaticamente
  function selecionarDoMal(anime) {
    setForm({
      nome: anime.nome,
      totalEps: anime.totalEps ? String(anime.totalEps) : "",
      assistidos: "0",
      status: "Planejando",
      capa: anime.capa,
    });
    setResultadosMal([]);
    setBuscaMal("");
  }

  const font = "'Inter', sans-serif";
  const fontDisplay = "'Plus Jakarta Sans', sans-serif";

  const animeEditando = animes.find((a) => a.id === editandoId);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (erros[name]) setErros((p) => ({ ...p, [name]: "" }));
  }

  function validar() {
    const e = {};
    if (!form.nome.trim()) e.nome = "Nome obrigatório.";
    if (!form.totalEps || Number(form.totalEps) <= 0) e.totalEps = "Valor inválido.";
    if (form.assistidos === "" || Number(form.assistidos) < 0) e.assistidos = "Valor inválido.";
    if (Number(form.assistidos) > Number(form.totalEps)) e.assistidos = "Maior que o total.";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const novosErros = validar();
    if (Object.keys(novosErros).length > 0) { setErros(novosErros); return; }

    const totalEps = Number(form.totalEps);
    const assistidos = Number(form.assistidos);

    // Status inicial automático conforme os episódios assistidos.
    // Respeita "Pausado" e "Finalizado" se a pessoa escolheu manualmente.
    let statusInicial = form.status;
    if (form.status !== "Pausado" && form.status !== "Finalizado") {
      if (assistidos === 0) statusInicial = "Planejando";
      else if (totalEps > 0 && assistidos >= totalEps) statusInicial = "Finalizado";
      else statusInicial = "Assistindo";
    }

    addAnime({ id: Date.now(), nome: form.nome.trim(), totalEps, assistidos, favorito: false, status: statusInicial, capa: form.capa.trim() });
    setForm({ nome: "", totalEps: "", assistidos: "", status: "Planejando", capa: "" });
    setErros({});
  }

  function handleSaveEdit(dados) {
    const anime = animes.find((a) => a.id === editandoId);
    let status = dados.status;

    // Se a pessoa NÃO mudou o status manualmente, recalcula conforme os episódios.
    // Se ela escolheu "Pausado" de propósito, respeita.
    const mudouStatusManual = anime && dados.status !== anime.status;
    if (!mudouStatusManual && dados.status !== "Pausado") {
      if (dados.assistidos === 0) status = "Planejando";
      else if (dados.totalEps > 0 && dados.assistidos >= dados.totalEps) status = "Finalizado";
      else status = "Assistindo";
    }

    updateAnime(editandoId, { ...dados, status });
    setEditandoId(null);
  }

  // 1. Filtra por status/favoritos
  let listaFiltrada =
    filtro === "Todos" ? animes
    : filtro === "Favoritos" ? animes.filter((a) => a.favorito)
    : animes.filter((a) => a.status === filtro);

  // 2. Filtra pela busca por nome
  if (buscaLista.trim()) {
    listaFiltrada = listaFiltrada.filter((a) =>
      a.nome.toLowerCase().includes(buscaLista.toLowerCase())
    );
  }

  // 3. Ordena conforme a opção escolhida
  listaFiltrada = [...listaFiltrada].sort((a, b) => {
    if (ordenacao === "nome") return a.nome.localeCompare(b.nome);
    if (ordenacao === "progresso") {
      const pa = a.totalEps > 0 ? a.assistidos / a.totalEps : 0;
      const pb = b.totalEps > 0 ? b.assistidos / b.totalEps : 0;
      return pb - pa; // maior progresso primeiro
    }
    if (ordenacao === "episodios") return b.totalEps - a.totalEps; // mais eps primeiro
    return 0; // recentes (ordem original)
  });

  const statusColor = (s) => {
    if (s === "Finalizado") return { bg: theme.success, text: theme.successText };
    if (s === "Assistindo") return { bg: theme.info, text: theme.infoText };
    if (s === "Pausado") return { bg: theme.warning, text: theme.warningText };
    if (s === "Planejando") return { bg: "#7c3aed", text: "#ffffff" };
    return { bg: theme.tagBg, text: theme.tagText };
  };

  const card = { background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: "14px", padding: isMobile ? "18px 16px" : "24px", marginBottom: "18px" };
  const input = { width: "100%", padding: "10px 13px", borderRadius: "8px", border: `1px solid ${theme.inputBorder}`, background: theme.inputBg, color: theme.text, fontSize: "14px", fontFamily: font, outline: "none", boxSizing: "border-box" };
  const lbl = { color: theme.textMuted, fontSize: "11px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px", display: "block", fontFamily: font };
  const viewBtn = (active) => ({ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: active ? "600" : "400", fontFamily: font, background: active ? "#7c3aed" : theme.tagBg, color: active ? "#fff" : theme.tagText });
  const epBtn = (disabled) => ({ width: "28px", height: "28px", borderRadius: "6px", border: `1px solid ${theme.border}`, background: disabled ? theme.tagBg : theme.inputBg, color: disabled ? theme.textMuted : theme.text, cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "600", flexShrink: 0 });

  // ── Vista lista ──
  function AnimeRow({ anime }) {
    const pct = anime.totalEps > 0 ? Math.round((anime.assistidos / anime.totalEps) * 100) : 0;
    const sc = statusColor(anime.status);
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${theme.border}`, gap: "10px", flexWrap: isMobile ? "wrap" : "nowrap" }}>
        {anime.capa ? (
          <img src={anime.capa} alt={anime.nome} style={{ width: "36px", height: "50px", borderRadius: "5px", objectFit: "cover", flexShrink: 0 }} onError={(e) => { e.target.style.display = "none"; }} />
        ) : (
          <div style={{ width: "36px", height: "50px", borderRadius: "5px", background: theme.tagBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: 0.5 }}><ImgIcon /></div>
        )}
        <div style={{ flex: 1, minWidth: isMobile ? "100%" : "120px" }}>
          <p style={{ color: theme.text, fontWeight: "600", fontSize: "14px", fontFamily: fontDisplay }}>{anime.nome}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
            <button style={epBtn(anime.assistidos <= 0)} onClick={() => updateEpisodios(anime.id, -1)} disabled={anime.assistidos <= 0}>−</button>
            <span style={{ color: theme.textMuted, fontSize: "12px", fontFamily: font, minWidth: "80px", textAlign: "center" }}>{anime.assistidos}/{anime.totalEps} eps · {pct}%</span>
            <button style={epBtn(anime.assistidos >= anime.totalEps)} onClick={() => updateEpisodios(anime.id, 1)} disabled={anime.assistidos >= anime.totalEps}>+</button>
          </div>
          <div style={{ width: "110px", height: "3px", background: theme.border, borderRadius: "2px", overflow: "hidden", marginTop: "6px" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#10b981" : "#7c3aed", borderRadius: "2px" }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: "2px" }} onClick={() => toggleFavorito(anime.id)}><StarIcon filled={anime.favorito} /></button>
          <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: "600", fontFamily: font, background: sc.bg, color: sc.text, whiteSpace: "nowrap" }}>{anime.status}</span>
          <button
            onClick={() => setEditandoId(anime.id)}
            style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: theme.accentLight, color: theme.accentText, border: "none", borderRadius: "7px", padding: "6px 10px", cursor: "pointer", fontSize: "12px", fontWeight: "600", fontFamily: font }}
          >
            <EditIcon /> Editar
          </button>
          <button style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: theme.danger, color: theme.dangerText, border: "none", borderRadius: "7px", padding: "6px 10px", cursor: "pointer", fontSize: "12px", fontWeight: "600", fontFamily: font }} onClick={() => setConfirmandoRemocao(anime)}>
            <TrashIcon /> Remover
          </button>
        </div>
      </div>
    );
  }

  // ── Vista grade ──
  function AnimeCard({ anime }) {
    const pct = anime.totalEps > 0 ? Math.round((anime.assistidos / anime.totalEps) * 100) : 0;
    const sc = statusColor(anime.status);
    return (
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ position: "relative", height: "280px", background: theme.tagBg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {anime.capa ? (
            <img src={anime.capa} alt={anime.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.opacity = "0"; }} />
          ) : (
            <div style={{ opacity: 0.4, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}><ImgIcon /><span style={{ color: theme.textMuted, fontSize: "11px", fontFamily: font }}>Sem capa</span></div>
          )}
          <span style={{ position: "absolute", top: "8px", right: "8px", fontSize: "10px", padding: "3px 8px", borderRadius: "20px", fontWeight: "600", fontFamily: font, background: sc.bg, color: sc.text }}>{anime.status}</span>
          <button style={{ position: "absolute", top: "6px", left: "6px", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => toggleFavorito(anime.id)}>
            <StarIcon filled={anime.favorito} />
          </button>
          {/* Botão editar */}
          <button
            onClick={() => setEditandoId(anime.id)}
            style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(124,58,237,0.85)", border: "none", borderRadius: "7px", padding: "5px 9px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", color: "#fff", fontSize: "11px", fontWeight: "600", fontFamily: font }}
          >
            <EditIcon /> Editar
          </button>
        </div>
        <div style={{ padding: "14px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
          <p style={{ color: theme.text, fontWeight: "700", fontSize: "14px", fontFamily: fontDisplay, lineHeight: "1.3" }}>{anime.nome}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button style={epBtn(anime.assistidos <= 0)} onClick={() => updateEpisodios(anime.id, -1)} disabled={anime.assistidos <= 0}>−</button>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ color: theme.textMuted, fontSize: "11px", fontFamily: font }}>{anime.assistidos}/{anime.totalEps} eps</span>
                <span style={{ color: theme.textMuted, fontSize: "11px", fontFamily: font }}>{pct}%</span>
              </div>
              <div style={{ height: "3px", background: theme.border, borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#10b981" : "#7c3aed", borderRadius: "2px" }} />
              </div>
            </div>
            <button style={epBtn(anime.assistidos >= anime.totalEps)} onClick={() => updateEpisodios(anime.id, 1)} disabled={anime.assistidos >= anime.totalEps}>+</button>
          </div>
          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", background: theme.danger, color: theme.dangerText, border: "none", borderRadius: "7px", padding: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600", fontFamily: font, marginTop: "auto" }} onClick={() => setConfirmandoRemocao(anime)}>
            <TrashIcon /> Remover
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Modal de edição */}
      {editandoId && animeEditando && (
        <EditModal
          anime={animeEditando}
          onSave={handleSaveEdit}
          onCancel={() => setEditandoId(null)}
          theme={theme}
          font={font}
          fontDisplay={fontDisplay}
        />
      )}

      {/* Modal de confirmação de remoção */}
      {confirmandoRemocao && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={() => setConfirmandoRemocao(null)}>
          <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "400px", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </div>
            <h3 style={{ color: theme.text, fontSize: "17px", fontWeight: "700", fontFamily: fontDisplay, marginBottom: "8px" }}>Remover anime?</h3>
            <p style={{ color: theme.textMuted, fontSize: "14px", fontFamily: font, marginBottom: "22px", lineHeight: "1.5" }}>
              Tem certeza que deseja remover <strong style={{ color: theme.text }}>{confirmandoRemocao.nome}</strong> da sua lista? Essa ação não pode ser desfeita.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setConfirmandoRemocao(null)} style={{ flex: 1, padding: "11px", borderRadius: "8px", border: `1px solid ${theme.border}`, background: "transparent", color: theme.text, fontSize: "14px", fontWeight: "500", fontFamily: font, cursor: "pointer" }}>
                Cancelar
              </button>
              <button onClick={() => { removeAnime(confirmandoRemocao.id); setConfirmandoRemocao(null); }} style={{ flex: 1, padding: "11px", borderRadius: "8px", border: "none", background: "#ef4444", color: "#fff", fontSize: "14px", fontWeight: "600", fontFamily: font, cursor: "pointer" }}>
                Sim, remover
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 style={{ color: theme.text, fontSize: isMobile ? "20px" : "22px", fontWeight: "700", fontFamily: fontDisplay, marginBottom: "4px" }}>Minha Lista</h2>
      <p style={{ color: theme.textMuted, fontSize: "14px", fontFamily: font, marginBottom: "20px" }}>Gerencie seus animes, episódios e favoritos.</p>

      {/* Formulário */}
      <div style={card}>
        <p style={{ color: theme.text, fontSize: "14px", fontWeight: "600", fontFamily: font, marginBottom: "16px" }}>Adicionar novo anime</p>

        {/* ===== Busca no MyAnimeList (EXTRA) ===== */}
        <div style={{ background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "14px", marginBottom: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span style={{ color: theme.text, fontSize: "13px", fontWeight: "600", fontFamily: font }}>Buscar no MyAnimeList</span>
            <span style={{ color: theme.textMuted, fontSize: "11px", fontFamily: font }}>(preenche capa e episódios automaticamente)</span>
          </div>
          <div style={{ display: "flex", gap: "8px", flexDirection: isMobile ? "column" : "row" }}>
            <input
              style={{ ...input, flex: 1 }}
              value={buscaMal}
              onChange={(e) => setBuscaMal(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); buscarNoMal(); } }}
              placeholder="Ex: Naruto, One Piece, Bleach..."
            />
            <button
              type="button"
              onClick={buscarNoMal}
              disabled={buscandoMal}
              style={{ background: "#7c3aed", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: buscandoMal ? "wait" : "pointer", fontWeight: "600", fontSize: "14px", fontFamily: font, whiteSpace: "nowrap" }}
            >
              {buscandoMal ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {erroMal && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "8px", fontFamily: font }}>{erroMal}</p>}

          {/* Resultados da busca */}
          {resultadosMal.length > 0 && (
            <>
              <p style={{ color: theme.textMuted, fontSize: "11px", fontFamily: font, marginTop: "12px", marginBottom: "8px" }}>
                {resultadosMal.length} resultado{resultadosMal.length !== 1 ? "s" : ""} encontrado{resultadosMal.length !== 1 ? "s" : ""} — clique para preencher
              </p>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: "10px", maxHeight: "280px", overflowY: "auto", paddingRight: "4px" }}>
                {resultadosMal.map((anime, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selecionarDoMal(anime)}
                    style={{ display: "flex", gap: "10px", padding: "8px", borderRadius: "8px", border: `1px solid ${theme.border}`, background: theme.bgCard, cursor: "pointer", textAlign: "left", alignItems: "center" }}
                  >
                    <img src={anime.capa} alt={anime.nome} style={{ width: "40px", height: "56px", borderRadius: "5px", objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ overflow: "hidden" }}>
                      <p style={{ color: theme.text, fontSize: "12px", fontWeight: "600", fontFamily: fontDisplay, lineHeight: "1.3", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{anime.nome}</p>
                      <p style={{ color: theme.textMuted, fontSize: "11px", fontFamily: font, marginTop: "2px" }}>
                        {anime.totalEps ? `${anime.totalEps} eps` : "? eps"}
                        {anime.nota ? ` · ⭐ ${anime.nota}` : ""}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 150px", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={lbl}>Nome do anime *</label>
              <input style={input} name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Naruto Shippuden" />
              {erros.nome && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{erros.nome}</p>}
            </div>
            <div>
              <label style={lbl}>Status</label>
              <select style={input} name="status" value={form.status} onChange={handleChange}>
                <option value="Planejando">Planejando</option>
                <option value="Assistindo">Assistindo</option>
                <option value="Pausado">Pausado</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "110px 110px 1fr", gap: "12px" }}>
            <div>
              <label style={lbl}>Total eps *</label>
              <input style={input} name="totalEps" type="number" min="1" value={form.totalEps} onChange={handleChange} placeholder="220" />
              {erros.totalEps && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{erros.totalEps}</p>}
            </div>
            <div>
              <label style={lbl}>Assistidos *</label>
              <input style={input} name="assistidos" type="number" min="0" value={form.assistidos} onChange={handleChange} placeholder="0" />
              {erros.assistidos && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{erros.assistidos}</p>}
            </div>
            <div style={isMobile ? { gridColumn: "1 / -1" } : {}}>
              <label style={lbl}>URL da capa (opcional)</label>
              <input style={input} name="capa" value={form.capa} onChange={handleChange} placeholder="https://..." />
            </div>
          </div>
          <button type="submit" style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "#7c3aed", color: "#fff", border: "none", padding: "10px 22px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px", fontFamily: font, marginTop: "16px", width: isMobile ? "100%" : "auto", justifyContent: "center" }}>
            <PlusIcon /> Adicionar à lista
          </button>
        </form>
      </div>

      {/* Lista */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <p style={{ color: theme.text, fontSize: "14px", fontWeight: "600", fontFamily: font }}>
            Meus Animes{" "}
            <span style={{ color: theme.textMuted, fontWeight: "400" }}>({listaFiltrada.length} título{listaFiltrada.length !== 1 ? "s" : ""})</span>
          </p>
          <div style={{ display: "flex", gap: "4px", background: theme.inputBg, padding: "3px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
            <button style={viewBtn(visualizacao === "lista")} onClick={() => setVisualizacao("lista")}><ListIcon /> {!isMobile && "Lista"}</button>
            <button style={viewBtn(visualizacao === "grade")} onClick={() => setVisualizacao("grade")}><GridIcon /> {!isMobile && "Grade"}</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "6px", marginBottom: "14px", flexWrap: "wrap" }}>
          {FILTROS.map(({ key, label }) => (
            <button key={key} onClick={() => setFiltro(key)} style={{ padding: "6px 14px", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: filtro === key ? "600" : "400", fontFamily: font, background: filtro === key ? (key === "Favoritos" ? "#92400e" : "#7c3aed") : theme.tagBg, color: filtro === key ? "#fff" : theme.tagText, display: "flex", alignItems: "center", gap: "4px" }}>
              {key === "Favoritos" && <svg width="11" height="11" viewBox="0 0 24 24" fill={filtro === key ? "#fff" : "#f59e0b"} stroke={filtro === key ? "#fff" : "#f59e0b"} strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
              {label}
            </button>
          ))}
        </div>

        {/* Busca + ordenação na lista */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "18px", flexDirection: isMobile ? "column" : "row" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: theme.textMuted, display: "flex" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input
              style={{ ...input, paddingLeft: "36px" }}
              value={buscaLista}
              onChange={(e) => setBuscaLista(e.target.value)}
              placeholder="Buscar na minha lista..."
            />
          </div>
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            style={{ ...input, width: isMobile ? "100%" : "190px", cursor: "pointer" }}
          >
            <option value="recentes">Mais recentes</option>
            <option value="nome">Nome (A-Z)</option>
            <option value="progresso">Maior progresso</option>
            <option value="episodios">Mais episódios</option>
          </select>
        </div>

        {carregando ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: theme.textMuted }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></path></svg>
            <p style={{ marginTop: "12px", fontSize: "14px", fontFamily: font }}>Carregando sua lista...</p>
          </div>
        ) : listaFiltrada.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎬</div>
            <p style={{ color: theme.text, fontSize: "15px", fontWeight: "600", fontFamily: fontDisplay, marginBottom: "6px" }}>
              {buscaLista.trim() ? "Nenhum anime encontrado" : filtro === "Favoritos" ? "Nenhum favorito ainda" : filtro !== "Todos" ? `Nenhum anime "${filtro}"` : "Sua lista está vazia"}
            </p>
            <p style={{ color: theme.textMuted, fontSize: "13px", fontFamily: font }}>
              {buscaLista.trim() ? "Tente buscar por outro nome." : "Adicione seu primeiro anime usando o formulário acima!"}
            </p>
          </div>
        ) : visualizacao === "lista" ? (
          <div>{listaFiltrada.map((a) => <AnimeRow key={a.id} anime={a} />)}</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
            {listaFiltrada.map((a) => <AnimeCard key={a.id} anime={a} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default MinhaLista;
