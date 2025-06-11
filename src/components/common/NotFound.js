import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function NotFound() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 100, color: 'warning.main', mb: 4 }} />
        <Typography variant="h2" component="h1" gutterBottom>
          404: Pagina non trovata
        </Typography>
        <Typography variant="h5" color="text.secondary" align="center" paragraph>
          Oops! La pagina che stai cercando non esiste o è stata spostata.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/"
          size="large"
          sx={{ mt: 3 }}
        >
          Torna alla Home
        </Button>
      </Box>
    </Container>
  );
}

export default NotFound;
