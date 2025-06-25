import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({
  isDarkMode: true,
  toggleTheme: () => { },
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: light)"
      ).matches;
      setIsDarkMode(prefersDarkMode);
    }
  }, []);

  useEffect(() => {
    // Check if we're in a browser environment before accessing document
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.toggle("dark", isDarkMode);
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
