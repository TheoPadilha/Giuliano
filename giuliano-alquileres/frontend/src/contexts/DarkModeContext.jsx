import { createContext, useState, useContext, useEffect, useCallback } from "react";

const DarkModeContext = createContext({});

export const DarkModeProvider = ({ children }) => {
  // Get initial theme from localStorage or system preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      return savedTheme;
    }
    return "system";
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [effectiveTheme, setEffectiveTheme] = useState("light");

  // Function to get system preference
  const getSystemPreference = useCallback(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  }, []);

  // Calculate the effective theme (the actual theme to apply)
  const calculateEffectiveTheme = useCallback(() => {
    if (theme === "system") {
      return getSystemPreference();
    }
    return theme;
  }, [theme, getSystemPreference]);

  // Apply theme to document
  const applyTheme = useCallback((themeToApply) => {
    const root = document.documentElement;

    // Remove both classes first
    root.classList.remove("light", "dark");

    // Add the appropriate class
    root.classList.add(themeToApply);

    // Update effective theme state
    setEffectiveTheme(themeToApply);
  }, []);

  // Initialize theme on mount (before render to prevent flash)
  useEffect(() => {
    const initialEffectiveTheme = calculateEffectiveTheme();
    applyTheme(initialEffectiveTheme);
  }, [calculateEffectiveTheme, applyTheme]);

  // Listen to system preference changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      const newEffectiveTheme = e.matches ? "dark" : "light";
      applyTheme(newEffectiveTheme);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme, applyTheme]);

  // Update theme when it changes
  useEffect(() => {
    const newEffectiveTheme = calculateEffectiveTheme();
    applyTheme(newEffectiveTheme);
    localStorage.setItem("theme", theme);
  }, [theme, calculateEffectiveTheme, applyTheme]);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      if (prevTheme === "light") return "dark";
      if (prevTheme === "dark") return "light";
      // If system, toggle to opposite of current effective theme
      return effectiveTheme === "dark" ? "light" : "dark";
    });
  }, [effectiveTheme]);

  // Set specific theme
  const setThemeMode = useCallback((newTheme) => {
    if (["light", "dark", "system"].includes(newTheme)) {
      setTheme(newTheme);
    }
  }, []);

  const value = {
    theme, // Current theme setting (light, dark, or system)
    effectiveTheme, // Actual theme being applied (light or dark)
    toggleTheme,
    setTheme: setThemeMode,
    isDark: effectiveTheme === "dark",
    isLight: effectiveTheme === "light",
    isSystemPreference: theme === "system",
  };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};

export default DarkModeContext;
