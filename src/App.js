import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Typography, CircularProgress } from '@mui/material';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Dashboard from './components/dashboard/Dashboard';
import ImageClassification from './components/classification/ImageClassification';
import ClassificationResult from './components/classification/ClassificationResult';
import Leaderboard from './components/leaderboard/Leaderboard';
import UserStatistics from './components/statistics/UserStatistics';
import AchievementsList from './components/statistics/AchievementsList';
import NotFound from './components/common/NotFound';
import AnimatedBackground from './components/common/AnimatedBackground';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Services
import { AuthProvider } from './services/AuthContext';

// Theme
const theme = createTheme({
  palette: {
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
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '0em',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      letterSpacing: '0.0075em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          transition: 'background-color 0.2s ease',
        },
        a: {
          textDecoration: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 20px',
          fontWeight: 500,
          boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
          transition: 'all 0.25s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        },
        elevation3: {
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          background: 'linear-gradient(90deg, #4caf50 0%, #2e7d32 100%)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Check if user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    
    // Simulazione di caricamento iniziale
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        {loading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)'
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                animation: 'fadeIn 1s ease-in-out'
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3
                }}
              >
                <Box 
                  component="img" 
                  src="/logo192.png" 
                  alt="WasteWatch Logo"
                  sx={{ 
                    width: 60, 
                    height: 60,
                    mr: 2,
                    animation: 'pulse 2s infinite'
                  }}
                />
                <Typography 
                  variant="h4"
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #4caf50 30%, #2e7d32 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  WasteWatch
                </Typography>
              </Box>
              <CircularProgress color="primary" />
            </Box>
          </Box>
        ) : (
          <AnimatedBackground>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              minHeight: '100vh' 
            }}>
              <Header />
              <Box sx={{ 
                flexGrow: 1, 
                py: 3, 
                px: { xs: 2, md: 4 } 
              }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/classification" element={<ImageClassification />} />
                  <Route path="/classification/result/:id" element={<ClassificationResult />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/statistics" element={<UserStatistics />} />
                  <Route path="/achievements" element={<AchievementsList />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Box>
              <Footer />
            </Box>
          </AnimatedBackground>
        )}
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
