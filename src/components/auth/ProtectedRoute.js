import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Componente che protegge le rotte che richiedono autenticazione.
 * Se l'utente non è autenticato, viene reindirizzato alla pagina di login.
 */
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Se stiamo ancora verificando l'autenticazione, mostra un loader
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Verifica autenticazione...
        </Typography>
      </Box>
    );
  }

  // Se l'utente non è autenticato, reindirizza al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se l'utente è autenticato, mostra il contenuto della rotta
  return children;
};

export default ProtectedRoute;
