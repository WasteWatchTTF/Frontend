import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarIcon,
  RecyclingRounded as RecyclingIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { classificationAPI } from '../../services/api';

function ClassificationResult() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClassificationResult = async () => {
      try {
        const response = await classificationAPI.getClassificationResult(id);
        setResult(response.data);
      } catch (err) {
        console.error('Error fetching classification result:', err);
        setError('Impossibile caricare i dettagli della classificazione. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClassificationResult();
    }
  }, [id]);

  // Function to get color based on waste type
  const getWasteTypeColor = (wasteType) => {
    const typeColors = {
      'PLASTICA': '#ffeb3b', // Yellow
      'CARTA': '#2196f3',    // Blue
      'VETRO': '#4caf50',    // Green
      'ORGANICO': '#795548', // Brown
      'INDIFFERENZIATO': '#9e9e9e', // Grey
      'METALLO': '#f44336',  // Red
      'RAEE': '#9c27b0',     // Purple
    };
    
    // Default color if waste type is not in the map
    return typeColors[wasteType?.toUpperCase()] || '#9e9e9e';
  };

  // Function to get icon based on waste type
  const getWasteTypeIcon = (wasteType) => {
    // In a real app, you would use different icons for different waste types
    return <RecyclingIcon />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            component={RouterLink}
            to="/classification"
            startIcon={<ArrowBackIcon />}
          >
            Torna alla classificazione
          </Button>
        </Box>
      </Container>
    );
  }

  if (!result) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning" sx={{ mt: 4 }}>
          Nessun risultato trovato per l'ID specificato.
        </Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            component={RouterLink}
            to="/classification"
            startIcon={<ArrowBackIcon />}
          >
            Torna alla classificazione
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3 }}>
        <Button
          component={RouterLink}
          to="/classification"
          startIcon={<ArrowBackIcon />}
        >
          Torna alla classificazione
        </Button>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 4 }, mb: 4 }} className="classification-result-card">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: getWasteTypeColor(result.category), mr: 2 }}>
            {getWasteTypeIcon(result.category)}
          </Avatar>
          <Typography variant="h4" component="h1">
            Risultato Classificazione
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              {result.imageUrl ? (
                <img
                  src={result.imageUrl}
                  alt="Classified waste"
                  style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                />
              ) : (
                <Box 
                  sx={{ 
                    height: 200, 
                    bgcolor: 'grey.200', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderRadius: '8px'
                  }}
                >
                  <Typography color="text.secondary">
                    Immagine non disponibile
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Informazioni
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Data classificazione" 
                    secondary={new Date(result.timestamp || Date.now()).toLocaleString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOnIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Comune" 
                    secondary={result.comune || 'Default'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Confidenza" 
                    secondary={`${Math.round((result.confidence || 0) * 100)}%`}
                  />
                </ListItem>
              </List>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ mb: 3, bgcolor: 'background.default' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Materiale Identificato
                </Typography>
                <Typography variant="h4" color="primary" gutterBottom>
                  {result.category || 'Non identificato'}
                </Typography>
                <Chip 
                  icon={<CheckCircleIcon />} 
                  label={`${Math.round((result.confidence || 0) * 100)}% confidenza`}
                  color="primary"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Come Smaltire
                </Typography>
                {result.disposalRule ? (
                  <>
                    <Typography variant="body1" paragraph>
                      {result.disposalRule.disposalMethod}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {result.disposalRule.detailedInstructions}
                    </Typography>
                    {result.disposalRule.binColor && (
                      <Chip 
                        icon={<DeleteIcon />} 
                        label={`Bidone ${result.disposalRule.binColor}`}
                        sx={{ 
                          bgcolor: result.disposalRule.binColor.toLowerCase(), 
                          color: '#fff',
                          mr: 1 
                        }}
                      />
                    )}
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Questo materiale va conferito nella raccolta {result.category?.toLowerCase() || 'indifferenziata'}.
                    Verifica le regole specifiche del tuo comune per ulteriori dettagli.
                  </Typography>
                )}
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Impatto Ambientale
                </Typography>
                <Typography variant="body2" paragraph>
                  Smaltendo correttamente questo rifiuto contribuisci a:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Ridurre l'inquinamento ambientale" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Favorire il riciclo dei materiali" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Diminuire i rifiuti in discarica" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            component={RouterLink}
            to="/classification"
            variant="contained"
            color="primary"
            startIcon={<RecyclingIcon />}
          >
            Classifica un nuovo rifiuto
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ClassificationResult;
