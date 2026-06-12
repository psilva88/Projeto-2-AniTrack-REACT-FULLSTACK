import { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [contas, setContas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("anitrack_usuario");
    const contasSalvas = localStorage.getItem("anitrack_contas");
    if (usuarioSalvo) setUsuario(JSON.parse(usuarioSalvo));
    if (contasSalvas) setContas(JSON.parse(contasSalvas));
    setCarregando(false);
  }, []);

  function persistirContas(novasContas) {
    setContas(novasContas);
    localStorage.setItem("anitrack_contas", JSON.stringify(novasContas));
  }

  async function login({ email, senha }) {
    const data = await authService.login({ email, senha });
    const usuarioComToken = { ...data.usuario, token: data.token };

    localStorage.setItem("anitrack_token", data.token);
    localStorage.setItem("anitrack_usuario", JSON.stringify(usuarioComToken));
    setUsuario(usuarioComToken);

    const semEssa = contas.filter((c) => c.email !== usuarioComToken.email);
    persistirContas([...semEssa, usuarioComToken]);

    return usuarioComToken;
  }

  async function register({ nome, email, senha }) {
    const data = await authService.register({ nome, email, senha });
    const usuarioComToken = { ...data.usuario, token: data.token };

    localStorage.setItem("anitrack_token", data.token);
    localStorage.setItem("anitrack_usuario", JSON.stringify(usuarioComToken));
    setUsuario(usuarioComToken);

    const semEssa = contas.filter((c) => c.email !== usuarioComToken.email);
    persistirContas([...semEssa, usuarioComToken]);

    return usuarioComToken;
  }

  function entrarVisitante() {
    const visitante = { nome: "Visitante", email: "", visitante: true };
    setUsuario(visitante);
    localStorage.removeItem("anitrack_token");
    localStorage.setItem("anitrack_usuario", JSON.stringify(visitante));
  }

  function trocarConta(conta) {
    setUsuario(conta);
    if (conta.token) {
      localStorage.setItem("anitrack_token", conta.token);
    } else {
      localStorage.removeItem("anitrack_token");
    }
    localStorage.setItem("anitrack_usuario", JSON.stringify(conta));
  }

  function logout() {
    if (usuario && !usuario.visitante) {
      const restantes = contas.filter((c) => c.email !== usuario.email);
      persistirContas(restantes);
    }
    setUsuario(null);
    localStorage.removeItem("anitrack_token");
    localStorage.removeItem("anitrack_usuario");
  }

  const isVisitante = usuario?.visitante === true;

  return (
    <AuthContext.Provider value={{ usuario, contas, carregando, isVisitante, login, register, entrarVisitante, logout, trocarConta }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
