import { useEffect, useState } from "react";
import { AppearanceContext } from "../hooks/appearanceContext";

// One session-wide preference survives route changes even without storage.
export function AppearanceProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("portfolio-theme") === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.style.colorScheme = theme;
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#192630' : '#f7f9fb';
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {
      // The provider retains the preference for this session.
    }
  }, [theme]);

  return <AppearanceContext.Provider value={{ theme, setTheme }}>{children}</AppearanceContext.Provider>;
}
