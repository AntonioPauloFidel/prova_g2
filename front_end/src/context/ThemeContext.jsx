import React, { createContext, useState, useContext, useEffect } from 'react';

// Criamos o Contexto
const ThemeContext = createContext();

// Provedor do Contexto que vai envolver a aplicação
export function ThemeProvider({ children }) {
  // Busca o tema salvo no navegador ou define 'dark' como padrão (já que o login é dark)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Toda vez que o tema mudar, atualiza a classe no <body> e salva no localStorage
  useEffect(() => {
    document.body.className = theme; // injeta a classe 'dark' ou 'light' no body
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Função para alternar entre os temas
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personalizado para usar o tema de forma rápida nos componentes
export function useTheme() {
  return useContext(ThemeContext);
}