import { createContext, useState, useContext } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  function toggleTheme() {
    setDarkMode((prev) => !prev);
  }

  // Paleta de cores para cada tema
  const theme = {
    dark: darkMode,
    bg: darkMode ? "#0f0f1a" : "#f4f6fb",
    bgCard: darkMode ? "#1a1a2e" : "#ffffff",
    bgSidebar: darkMode ? "#12122a" : "#1a1a2e",
    bgNav: darkMode ? "#12122a" : "#1a1a2e",
    text: darkMode ? "#e8e8f0" : "#1a1a2e",
    textMuted: darkMode ? "#9090b0" : "#6b7280",
    textNav: "#ffffff",
    border: darkMode ? "#2a2a4a" : "#e5e7eb",
    accent: "#7c3aed",
    accentLight: darkMode ? "#3b1f7a" : "#ede9fe",
    accentText: darkMode ? "#c4b5fd" : "#7c3aed",
    success: darkMode ? "#064e3b" : "#d1fae5",
    successText: darkMode ? "#6ee7b7" : "#065f46",
    warning: darkMode ? "#451a03" : "#fef3c7",
    warningText: darkMode ? "#fcd34d" : "#92400e",
    danger: darkMode ? "#450a0a" : "#fee2e2",
    dangerText: darkMode ? "#fca5a5" : "#991b1b",
    info: darkMode ? "#0c1a40" : "#dbeafe",
    infoText: darkMode ? "#93c5fd" : "#1e40af",
    tagBg: darkMode ? "#2a2a4a" : "#f3f4f6",
    tagText: darkMode ? "#c4b5fd" : "#374151",
    inputBg: darkMode ? "#1e1e3a" : "#f9fafb",
    inputBorder: darkMode ? "#3a3a5a" : "#d1d5db",
  };

  return (
    <ThemeContext.Provider value={{ theme, darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
