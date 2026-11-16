import { useEffect, useState } from "react";

// Remember the visitor's selected appearance.
export default function useAppearance() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("portfolio-theme") === "dark"
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.style.colorScheme = theme;

    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {
      // Appearance still works if storage is unavailable.
    }
  }, [theme]);

  return { theme, setTheme };
}
