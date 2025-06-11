import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Creazione del contesto per il tema
const ThemeContext = createContext();

// Hook personalizzato per utilizzare il contesto del tema
export const useTheme = () => useContext(ThemeContext);

// Provider del tema
export const ThemeProviderWrapper = ({ children }) => {
  // Recupera il tema dalle preferenze dell'utente o imposta il tema chiaro come predefinito
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Definizione del tema chiaro
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        light: '#80e27e',
        main: '#4caf50',
        dark: '#087f23',
        contrastText: '#fff',
      },
      secondary: {
        light: '#6ec6ff',
        main: '#2196f3',
        dark: '#0069c0',
        contrastText: '#fff',
      },
      success: {
        main: '#66bb6a',
        dark: '#388e3c',
      },
      info: {
        main: '#29b6f6',
        dark: '#0288d1',
      },
      warning: {
        main: '#ffa726',
        dark: '#f57c00',
      },
      error: {
        main: '#f44336',
        dark: '#d32f2f',
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
    },
  });

  // Definizione del tema scuro
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        light: '#80e27e',
        main: '#4caf50',
        dark: '#087f23',
        contrastText: '#fff',
      },
      secondary: {
        light: '#6ec6ff',
        main: '#2196f3',
        dark: '#0069c0',
        contrastText: '#fff',
      },
      success: {
        main: '#66bb6a',
        dark: '#388e3c',
      },
      info: {
        main: '#29b6f6',
        dark: '#0288d1',
      },
      warning: {
        main: '#ffa726',
        dark: '#f57c00',
      },
      error: {
        main: '#f44336',
        dark: '#d32f2f',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
    },
  });

  // Salva il tema nelle preferenze dell'utente quando cambia
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Funzione per cambiare tema
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Valore del contesto
  const themeContextValue = {
    darkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
