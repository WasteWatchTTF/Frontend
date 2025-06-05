import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, CircularProgress } from '@mui/material';

// Theme Provider
import { ThemeProviderWrapper } from './services/ThemeContext';

// Auth Components
import ProtectedRoute from './components/auth/ProtectedRoute';

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
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'; // Importa la nuova pagina

// Services
import { AuthProvider } from './services/AuthContext';

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
    <ThemeProviderWrapper>
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
                  {/* Rotte pubbliche */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  
                  {/* Rotte protette (richiedono autenticazione) */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/classification" element={
                    <ProtectedRoute>
                      <ImageClassification />
                    </ProtectedRoute>
                  } />
                  <Route path="/classification/result/:id" element={
                    <ProtectedRoute>
                      <ClassificationResult />
                    </ProtectedRoute>
                  } />
                  <Route path="/leaderboard" element={
                    <ProtectedRoute>
                      <Leaderboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/statistics" element={
                    <ProtectedRoute>
                      <UserStatistics />
                    </ProtectedRoute>
                  } />
                  <Route path="/achievements" element={
                    <ProtectedRoute>
                      <AchievementsList />
                    </ProtectedRoute>
                  } />
                  
                  {/* Rotta per pagine non trovate */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Box>
              <Footer />
            </Box>
          </AnimatedBackground>
        )}
      </AuthProvider>
    </ThemeProviderWrapper>
  );
}

export default App;
