// ===== Camada de comunicação com a API (backend Node.js) =====
const API_URL = "http://localhost:3000/api";

// Recupera o token salvo no localStorage
function getToken() {
  return localStorage.getItem("anitrack_token");
}

// Função genérica para chamadas à API
async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Adiciona o token JWT no header se existir
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  // 204 No Content (delete) não tem body
  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.mensagem || "Erro na requisição");
  }

  return data;
}

// ===== AUTENTICAÇÃO =====
export const authService = {
  register: (dados) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(dados) }),
  login: (dados) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(dados) }),
};

// ===== ANIMES =====
export const animeService = {
  listar: () => request("/animes"),
  criar: (dados) =>
    request("/animes", { method: "POST", body: JSON.stringify(dados) }),
  atualizar: (id, dados) =>
    request(`/animes/${id}`, { method: "PUT", body: JSON.stringify(dados) }),
  remover: (id) => request(`/animes/${id}`, { method: "DELETE" }),
};

// ===== JIKAN (API pública do MyAnimeList) — EXTRA =====
// Busca animes pelo nome e retorna capa, episódios e título automaticamente
export const jikanService = {
  buscar: async (nome) => {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(nome)}&limit=20&sfw`
    );
    if (!res.ok) throw new Error("Erro ao buscar no MyAnimeList");
    const data = await res.json();
    return data.data.map((a) => ({
      malId: a.mal_id,
      nome: a.title,
      totalEps: a.episodes || 0,
      capa: a.images?.jpg?.image_url || "",
      nota: a.score || null,
    }));
  },

  // Top animes populares (atualiza sozinho conforme o ranking do MyAnimeList)
  topAnimes: async (limite = 6) => {
    const res = await fetch(
      `https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=${limite}&sfw`
    );
    if (!res.ok) throw new Error("Erro ao buscar top animes");
    const data = await res.json();
    return data.data.map((a) => ({
      malId: a.mal_id,
      nome: a.title,
      totalEps: a.episodes || 0,
      // Usa a imagem em alta qualidade (large), com fallback pra normal
      capa: a.images?.jpg?.large_image_url || a.images?.jpg?.image_url || "",
      nota: a.score || null,
      generos: (a.genres || []).map((g) => g.name).join(", "),
    }));
  },
};

export { getToken };
