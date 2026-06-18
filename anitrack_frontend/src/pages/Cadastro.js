import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function EyeOpenIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function EyeOffIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}

function Cadastro() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [erroApi, setErroApi] = useState("");

  const font = "'Inter', sans-serif";
  const fontDisplay = "'Plus Jakarta Sans', sans-serif";

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (erros[name]) setErros((p) => ({ ...p, [name]: "" }));
  }

  function validar() {
    const e = {};
    if (!form.nome.trim()) e.nome = "O nome é obrigatório.";
    if (!form.email.trim()) e.email = "O e-mail é obrigatório.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "E-mail inválido.";
    if (!form.senha) e.senha = "A senha é obrigatória.";
    else if (form.senha.length < 6) e.senha = "Mínimo de 6 caracteres.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErroApi("");
    const novosErros = validar();
    if (Object.keys(novosErros).length > 0) { setErros(novosErros); return; }
    setLoading(true);
    try {
      await register({ nome: form.nome.trim(), email: form.email, senha: form.senha });
      navigate("/home");
    } catch (err) {
      setErroApi(err.message || "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = (hasError) => ({
    width: "100%", padding: "13px 14px", borderRadius: "10px",
    border: `1.5px solid ${hasError ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
    background: "rgba(255,255,255,0.06)", color: "#f1f5f9",
    fontSize: "15px", fontFamily: font, outline: "none", boxSizing: "border-box",
  });

  const lbl = { display: "block", color: "#64748b", fontSize: "12px", fontWeight: "600", fontFamily: font, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "7px" };

  return (
    <div style={{ background: "linear-gradient(160deg, #080814 0%, #0d1628 50%, #0a1929 100%)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />

      <div style={{ marginBottom: "28px", zIndex: 1 }}>
        <div style={{ display: "inline-block" }}>
          <img src="/images/logo.png" alt="AniTrack" style={{ height: "120px", width: "auto", display: "block" }} />
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: "400px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "20px", padding: "36px 32px", position: "relative", zIndex: 1 }}>
        <h1 style={{ color: "#f1f5f9", fontSize: "22px", fontWeight: "700", fontFamily: fontDisplay, marginBottom: "6px", textAlign: "center" }}>Criar sua conta</h1>
        <p style={{ color: "#475569", fontSize: "14px", fontFamily: font, textAlign: "center", marginBottom: "28px" }}>Comece a organizar seus animes agora</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={lbl}>Nome completo</label>
            <input style={inputStyle(!!erros.nome)} name="nome" type="text" value={form.nome} onChange={handleChange} placeholder="Seu nome" />
            {erros.nome && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "5px", fontFamily: font }}>{erros.nome}</p>}
          </div>
          <div>
            <label style={lbl}>E-mail</label>
            <input style={inputStyle(!!erros.email)} name="email" type="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" />
            {erros.email && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "5px", fontFamily: font }}>{erros.email}</p>}
          </div>
          <div>
            <label style={lbl}>Senha</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input style={{ ...inputStyle(!!erros.senha), paddingRight: "44px" }} name="senha" type={showSenha ? "text" : "password"} value={form.senha} onChange={handleChange} placeholder="Mínimo 6 caracteres" />
              <button type="button" onClick={() => setShowSenha(!showSenha)} style={{ position: "absolute", right: "13px", background: "none", border: "none", color: "#475569", cursor: "pointer", display: "flex", padding: "0" }}>
                {showSenha ? <EyeOpenIcon /> : <EyeOffIcon />}
              </button>
            </div>
            {erros.senha && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "5px", fontFamily: font }}>{erros.senha}</p>}
          </div>

          {erroApi && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "10px 12px", marginTop: "2px" }}>
              <p style={{ color: "#ef4444", fontSize: "13px", fontFamily: font, textAlign: "center" }}>{erroApi}</p>
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: "10px", border: "none", background: loading ? "#5b21b6" : "#7c3aed", color: "#fff", fontSize: "15px", fontWeight: "600", fontFamily: font, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "4px" }}>
            {loading ? (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></path></svg>Criando conta...</>) : "Criar conta"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
          <span style={{ color: "#334155", fontSize: "12px", fontFamily: font }}>ou</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
        </div>

        <p style={{ textAlign: "center", color: "#475569", fontSize: "14px", fontFamily: font }}>
          Já tem uma conta?{" "}
          <Link to="/" style={{ color: "#a78bfa", fontWeight: "600", textDecoration: "none" }}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;
