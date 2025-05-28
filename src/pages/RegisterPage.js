import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import Register from '../components/auth/Register';

const RegisterPage = () => {
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
            Registrati a WasteWatch
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Crea un account per iniziare a utilizzare la piattaforma
          </Typography>
        </Box>
        
        <Register />
      </Paper>
    </Container>
  );
};

export default RegisterPage;
