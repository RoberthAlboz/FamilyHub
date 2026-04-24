import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('familyhub_theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('familyhub_theme', isDarkMode ? 'dark' : 'light');
    
    // Aplicar tema ao documento
    if (isDarkMode) {
      document.documentElement.style.backgroundColor = '#1a1a1a';
      document.body.style.backgroundColor = '#1a1a1a';
      document.body.style.color = '#ffffff';
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.style.backgroundColor = '#fafafa';
      document.body.style.backgroundColor = '#fafafa';
      document.body.style.color = '#37352f';
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
}
