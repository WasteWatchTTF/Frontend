import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import Login from '../components/auth/Login';

const LoginPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper 
        elevation={3}
        sx={{ 
          p: 4, 
          borderRadius: 2,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Accedi a WasteWatch
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Inserisci le tue credenziali per accedere alla piattaforma
          </Typography>
        </Box>
        
        <Login />
      </Paper>
    </Container>
  );
};

export default LoginPage;
