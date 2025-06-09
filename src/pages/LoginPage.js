import React, { useEffect } from 'react';
import { Box, Container, Paper, Typography, useTheme, Fade, Slide } from '@mui/material';
import { useTheme as useCustomTheme } from '../services/ThemeContext';
import { useAuth } from '../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import RecyclingIcon from '@mui/icons-material/Recycling';
import Login from '../components/auth/Login';

const LoginPage = () => {
  const theme = useTheme();
  const { darkMode } = useCustomTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);


  if (user) {
    return null;
  }
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: darkMode 
          ? 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 35%, #2d3748 100%)'
          : 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 35%, #e0f2f1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 3, md: 4 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode
            ? 'radial-gradient(circle at 30% 20%, rgba(76, 175, 80, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(46, 125, 50, 0.08) 0%, transparent 50%)'
            : 'radial-gradient(circle at 30% 20%, rgba(76, 175, 80, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(46, 125, 50, 0.15) 0%, transparent 50%)',
          animation: 'float 20s ease-in-out infinite',
        },
        // Elementi decorativi del background
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '10%',
          right: '15%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: darkMode
            ? 'radial-gradient(circle, rgba(76, 175, 80, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(76, 175, 80, 0.2) 0%, transparent 70%)',
          animation: 'floatSlow 25s ease-in-out infinite reverse',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(-20px, -20px) rotate(2deg)' },
        },
        '@keyframes floatSlow': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(30px, -30px) scale(1.1)' },
        },
        '@keyframes fadeInUp': {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        '@keyframes scaleIn': {
          '0%': { opacity: 0, transform: 'scale(0.9)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      }}
    >
      {/* Elementi decorativi aggiuntivi */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: darkMode
            ? 'linear-gradient(45deg, rgba(76, 175, 80, 0.05) 0%, rgba(46, 125, 50, 0.1) 100%)'
            : 'linear-gradient(45deg, rgba(76, 175, 80, 0.1) 0%, rgba(46, 125, 50, 0.2) 100%)',
          animation: 'float 15s ease-in-out infinite',
          zIndex: 0,
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '20%',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: darkMode
            ? 'rgba(76, 175, 80, 0.08)'
            : 'rgba(76, 175, 80, 0.15)',
          animation: 'floatSlow 18s ease-in-out infinite',
          zIndex: 0,
        }}
      />

      <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 }, position: 'relative', zIndex: 1 }}>
        <Fade in={true} timeout={800}>
          <Paper 
            elevation={darkMode ? 12 : 8}
            sx={{ 
              p: { xs: 4, sm: 5, md: 6 },
              borderRadius: 4,
              boxShadow: darkMode 
                ? '0 20px 60px rgba(0,0,0,0.4), 0 8px 30px rgba(76, 175, 80, 0.1)'
                : '0 20px 60px rgba(76, 175, 80, 0.15), 0 8px 30px rgba(0,0,0,0.1)',
              backgroundColor: darkMode 
                ? 'rgba(30, 30, 30, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: darkMode 
                ? '1px solid rgba(76, 175, 80, 0.2)' 
                : '1px solid rgba(76, 175, 80, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              animation: 'scaleIn 0.6s ease-out',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #4caf50 0%, #2e7d32 50%, #4caf50 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s ease-in-out infinite',
              },
              '@keyframes shimmer': {
                '0%': { backgroundPosition: '-200% 0' },
                '100%': { backgroundPosition: '200% 0' },
              },
            }}
          >
            <Slide direction="down" in={true} timeout={600}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Box 
                  sx={{ 
                    p: 2,
                    borderRadius: '50%',
                    background: darkMode
                      ? 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)'
                      : 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                    boxShadow: darkMode
                      ? '0 8px 25px rgba(76, 175, 80, 0.3)'
                      : '0 8px 25px rgba(76, 175, 80, 0.4)',
                    mb: 2,
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.05)' },
                    },
                  }}
                >
                  <RecyclingIcon sx={{ fontSize: 50, color: 'white' }} />
                </Box>
                <Typography 
                  variant="h4" 
                  component="div" 
                  fontWeight="bold" 
                  sx={{
                    background: darkMode
                      ? 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)'
                      : 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                    textAlign: 'center',
                    animation: 'fadeInUp 0.8s ease-out 0.2s both',
                  }}
                >
                  WasteWatch
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    textAlign: 'center',
                    animation: 'fadeInUp 0.8s ease-out 0.4s both',
                  }}
                >
                  La tua guida smart per un riciclo consapevole
                </Typography>
              </Box>
            </Slide>

            <Box 
              sx={{ 
                textAlign: 'center', 
                mb: 3,
                animation: 'fadeInUp 0.8s ease-out 0.6s both',
              }}
            >
              <Typography 
                variant="h5" 
                component="h1" 
                fontWeight="bold" 
                gutterBottom 
                color="text.primary"
                sx={{ mb: 1 }}
              >
                Bentornato!
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ 
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                Accedi al tuo account per continuare il tuo viaggio verso un futuro più verde
              </Typography>
            </Box>
            
            <Box sx={{ animation: 'fadeInUp 0.8s ease-out 0.8s both' }}>
              <Login />
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default LoginPage;
