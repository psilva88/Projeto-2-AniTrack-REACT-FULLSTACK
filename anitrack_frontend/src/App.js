import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AnimeProvider } from "./context/AnimeContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MinhaLista from "./pages/MinhaLista";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";
import { useResponsive } from "./hooks/useResponsive";

const AUTH_ROUTES = ["/", "/cadastro"];

function Layout() {
  const location = useLocation();
  const { isMobile } = useResponsive();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!isAuthPage && <Navbar />}
      {}
      <div style={{ flex: 1, paddingBottom: !isAuthPage && isMobile ? "64px" : "0" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="minha-lista" element={<MinhaLista />} />
            <Route path="perfil" element={<Perfil />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!isAuthPage && !isMobile && <Footer />}
      {}
      {!isAuthPage && isMobile && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AnimeProvider>
          <BrowserRouter>
            <Layout />
          </BrowserRouter>
        </AnimeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
