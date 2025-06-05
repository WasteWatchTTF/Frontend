import React from 'react';
import { Box, Container, Paper, Typography, useTheme } from '@mui/material'; // Aggiunto useTheme
import { useTheme as useCustomTheme } from '../services/ThemeContext'; // Rinominato per evitare conflitti
import RecyclingIcon from '@mui/icons-material/Recycling'; // Aggiunto import per icona
import Register from '../components/auth/Register';

const RegisterPage = () => {
  const theme = useTheme(); // Hook di MUI per accedere al tema completo
  const { darkMode } = useCustomTheme(); // Hook personalizzato per sapere se è dark mode
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default, // Sfondo dal tema
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 4, md: 6 }
      }}
    >
      <Container maxWidth="xs" sx={{ px: 2 }}> 
        <Paper 
          elevation={6} 
          sx={{ 
            p: { xs: 3, sm: 4 }, 
            borderRadius: 3, 
            boxShadow: darkMode ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0,0,0,0.1)', // Ombra adattiva
            backgroundColor: theme.palette.background.paper, // Sfondo del form dal tema 
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <RecyclingIcon sx={{ fontSize: 50, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5" component="div" fontWeight="bold" color="text.primary">
              WasteWatch
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom color="text.primary">
              Crea Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Unisciti a noi per un futuro più verde!
            </Typography>
          </Box>
          
          <Register />
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
