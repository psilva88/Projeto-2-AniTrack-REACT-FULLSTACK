import { createContext, useState, useContext, useEffect } from "react";
import { animeService } from "../services/api";
import { useAuth } from "./AuthContext";

export const AnimeContext = createContext();

const hoje = new Date().toLocaleDateString("pt-BR");

const historicoInicial = [];

export function AnimeProvider({ children }) {
  const { usuario, isVisitante } = useAuth();
  const [animes, setAnimes] = useState([]);
  const [historico, setHistorico] = useState(historicoInicial);
  const [carregando, setCarregando] = useState(false);

  // Normaliza o anime vindo da API (_id → id)
  function normalizar(a) {
    return { ...a, id: a._id || a.id };
  }

  function addHistorico(acao, anime) {
    setHistorico((prev) => [{ id: Date.now(), acao, anime, data: hoje }, ...prev]);
  }

  // Carrega os animes quando o usuário muda
  useEffect(() => {
    async function carregar() {
      if (!usuario) {
        setAnimes([]);
        return;
      }
      // Visitante: começa com lista vazia (pode adicionar localmente)
      if (isVisitante) {
        setAnimes([]);
        return;
      }
      // Logado: busca da API
      try {
        setCarregando(true);
        const dados = await animeService.listar();
        setAnimes(dados.map(normalizar));
      } catch (err) {
        console.error("Erro ao carregar animes:", err.message);
        setAnimes([]);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [usuario?.email, usuario?.token, isVisitante]);

  // ADICIONAR
  async function addAnime(novo) {
    if (isVisitante) {
      setAnimes((prev) => [{ ...novo, id: Date.now() }, ...prev]);
      addHistorico("Adicionou", novo.nome);
      return;
    }
    const criado = await animeService.criar(novo);
    setAnimes((prev) => [normalizar(criado), ...prev]);
    addHistorico("Adicionou", novo.nome);
  }

  // REMOVER
  async function removeAnime(id) {
    if (isVisitante) {
      setAnimes((prev) => prev.filter((a) => a.id !== id));
      return;
    }
    await animeService.remover(id);
    setAnimes((prev) => prev.filter((a) => a.id !== id));
  }

  // FAVORITAR
  async function toggleFavorito(id) {
    const anime = animes.find((a) => a.id === id);
    if (!anime) return;
    const novoValor = !anime.favorito;

    if (isVisitante) {
      setAnimes((prev) => prev.map((a) => (a.id === id ? { ...a, favorito: novoValor } : a)));
      if (novoValor) addHistorico("Favoritou", anime.nome);
      return;
    }
    const atualizado = await animeService.atualizar(id, { favorito: novoValor });
    setAnimes((prev) => prev.map((a) => (a.id === id ? normalizar(atualizado) : a)));
    if (novoValor) addHistorico("Favoritou", anime.nome);
  }

  // ATUALIZAR EPISÓDIOS (+/-)
  async function updateEpisodios(id, delta) {
    const anime = animes.find((a) => a.id === id);
    if (!anime) return;
    const novoVal = Math.min(Math.max(0, anime.assistidos + delta), anime.totalEps);
    const novoStatus = novoVal === anime.totalEps && anime.totalEps > 0 ? "Finalizado" : anime.status;
    const finalizou = novoVal === anime.totalEps && anime.totalEps > 0 && anime.status !== "Finalizado";

    if (isVisitante) {
      setAnimes((prev) => prev.map((a) => (a.id === id ? { ...a, assistidos: novoVal, status: novoStatus } : a)));
      if (finalizou) addHistorico("Finalizou", anime.nome);
      return;
    }
    const atualizado = await animeService.atualizar(id, { assistidos: novoVal, status: novoStatus });
    setAnimes((prev) => prev.map((a) => (a.id === id ? normalizar(atualizado) : a)));
    if (finalizou) addHistorico("Finalizou", anime.nome);
  }

  // EDITAR
  async function updateAnime(id, dados) {
    if (isVisitante) {
      setAnimes((prev) => prev.map((a) => (a.id === id ? { ...a, ...dados } : a)));
      addHistorico("Editou", dados.nome || "anime");
      return;
    }
    const atualizado = await animeService.atualizar(id, dados);
    setAnimes((prev) => prev.map((a) => (a.id === id ? normalizar(atualizado) : a)));
    addHistorico("Editou", dados.nome || "anime");
  }

  const stats = {
    total: animes.length,
    episodiosAssistidos: animes.reduce((s, a) => s + a.assistidos, 0),
    finalizados: animes.filter((a) => a.status === "Finalizado").length,
    favoritos: animes.filter((a) => a.favorito).length,
  };

  return (
    <AnimeContext.Provider value={{ animes, historico, stats, carregando, addAnime, removeAnime, toggleFavorito, updateEpisodios, updateAnime }}>
      {children}
    </AnimeContext.Provider>
  );
}

export function useAnime() {
  return useContext(AnimeContext);
}
