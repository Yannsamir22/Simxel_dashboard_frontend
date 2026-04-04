import { useEffect, useState } from "react";

type ThemeType = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem("theme") as ThemeType) || "system";
  });

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return { theme, setTheme };
}

function applyTheme(theme: ThemeType) {
  const resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  const daisyTheme = resolved === "dark" ? "simxel-dark" : "simxel-light";
  document.documentElement.setAttribute("data-theme", daisyTheme);
}
