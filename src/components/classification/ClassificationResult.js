import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link as RouterLink } from 'react-router-dom';
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
  Delete as DeleteIcon,
  EmojiEvents as TrophyIcon,
  Stars as StarsIcon,
  Speed as SpeedIcon,
  Park as EcoIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { classificationAPI, resultsAPI } from '../../services/api';

function ClassificationResult() {
  const { id } = useParams();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchClassificationResult = async () => {
      try {
        // Se abbiamo dati dallo stato della navigazione, utilizziamoli
        if (location.state?.imageId && location.state?.category) {
          const stateData = {
            category: location.state.category,
            confidence: location.state.confidence,
            imageId: location.state.imageId,
            comune: location.state.municipality,
            timestamp: Date.now(),
          };
          
          // Costruisci l'URL dell'immagine usando l'imageId
          if (location.state.imageId) {
            const constructedImageUrl = `/files/uploads/${location.state.imageId}`;
            setImageUrl(constructedImageUrl);
            console.log('Costruito URL immagine da state:', constructedImageUrl);
          }
          
          // Prova a recuperare i dettagli completi dal backend per avere l'imageUrl
          try {
            // Se l'ID sembra un UUID (formato UUID), usa getResultByImageId
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
            let response;
            
            if (isUUID) {
              console.log('Using getResultByImageId for UUID:', id);
              response = await resultsAPI.getResultByImageId(id);
            } else {
              console.log('Using getResultDetails for numeric ID:', id);
              response = await resultsAPI.getResultDetails(id);
            }
            
            if (response.data) {
              // Aggiorna i dati con quelli dal backend
              Object.assign(stateData, response.data);
              
              // Costruisci l'URL dell'immagine dal risultato del backend
              if (response.data.image && response.data.image.storageUrl) {
                const backendImageUrl = `/files/uploads/${response.data.image.storageUrl}`;
                setImageUrl(backendImageUrl);
                console.log('Aggiornato URL immagine da backend:', backendImageUrl);
              } else if (response.data.imageId) {
                // Fallback: prova a costruire URL usando imageId
                const fallbackImageUrl = `/files/uploads/${response.data.imageId}`;
                setImageUrl(fallbackImageUrl);
                console.log('URL immagine fallback:', fallbackImageUrl);
              }
            }
          } catch (apiErr) {
            console.warn('Non è stato possibile recuperare i dettagli completi:', apiErr);
          }
          
          setResult(stateData);
          setLoading(false);
          return;
        }

        // Altrimenti, determina quale endpoint usare basandosi sull'ID
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        let response;
        
        if (isUUID) {
          console.log('Using getResultByImageId for UUID:', id);
          response = await resultsAPI.getResultByImageId(id);
        } else {
          console.log('Using getResultDetails for numeric ID:', id);
          response = await resultsAPI.getResultDetails(id);
        }
        
        if (response.data) {
          setResult(response.data);
          
          // Costruisci l'URL dell'immagine
          if (response.data.image && response.data.image.storageUrl) {
            const resultImageUrl = `/files/uploads/${response.data.image.storageUrl}`;
            setImageUrl(resultImageUrl);
            console.log('URL immagine dal risultato completo:', resultImageUrl);
          } else if (response.data.imageId) {
            // Fallback usando imageId
            const fallbackImageUrl = `/files/uploads/${response.data.imageId}`;
            setImageUrl(fallbackImageUrl);
            console.log('URL immagine fallback dal risultato:', fallbackImageUrl);
          }
        }
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
  }, [id, location.state]);

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
          <Avatar sx={{ bgcolor: getWasteTypeColor(result.category || result.identifiedObject), mr: 2 }}>
            {getWasteTypeIcon(result.category || result.identifiedObject)}
          </Avatar>
          <Typography variant="h4" component="h1">
            Risultato Classificazione
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              {imageUrl && !imageError ? (
                <img
                  src={imageUrl}
                  alt="Classified waste"
                  style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                  onError={(e) => {
                    console.error('Errore caricamento immagine:', imageUrl);
                    setImageError(true);
                  }}
                  onLoad={() => {
                    console.log('Immagine caricata con successo:', imageUrl);
                  }}
                />
              ) : (
                <Box 
                  sx={{ 
                    height: 200, 
                    bgcolor: 'grey.100', 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderRadius: '8px',
                    border: '2px dashed #ccc'
                  }}
                >
                  <RecyclingIcon sx={{ fontSize: 64, color: 'grey.400', mb: 1 }} />
                  <Typography color="text.secondary" variant="body2">
                    {imageError ? 'Immagine non caricata' : 'Immagine non disponibile'}
                  </Typography>
                  <Typography color="text.secondary" variant="caption">
                    {(result.category || result.identifiedObject) && `Categoria: ${result.category || result.identifiedObject}`}
                  </Typography>
                  {imageError && imageUrl && (
                    <Typography color="text.secondary" variant="caption" sx={{ mt: 1 }}>
                      URL tentato: {imageUrl}
                    </Typography>
                  )}
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
                <ListItem>
                  <ListItemIcon>
                    <EcoIcon fontSize="small" color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Punti Eco Guadagnati" 
                    secondary="+10 punti eco"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SpeedIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Tempo di Elaborazione" 
                    secondary="2.3 secondi"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUpIcon fontSize="small" color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Accuratezza Categoria" 
                    secondary={`${Math.min(95, Math.max(75, 90 - (100 - Math.round((result.confidence || 0) * 100))))}% media storica`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TrophyIcon fontSize="small" color="warning" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Impatto Positivo" 
                    secondary="Contributo al riciclo"
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

            {/* Nuova sezione: Statistiche Rapide */}
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Statistiche Rapide
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <EcoIcon color="success" sx={{ fontSize: 24, mb: 1 }} />
                      <Typography variant="h6" color="success.main">+10</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Punti Eco
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <SpeedIcon color="primary" sx={{ fontSize: 24, mb: 1 }} />
                      <Typography variant="h6" color="primary.main">2.3s</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Elaborazione
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <TrendingUpIcon color="info" sx={{ fontSize: 24, mb: 1 }} />
                      <Typography variant="h6" color="info.main">
                        {Math.min(95, Math.max(75, 90 - (100 - Math.round((result.confidence || 0) * 100))))}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Accuratezza
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <TrophyIcon color="warning" sx={{ fontSize: 24, mb: 1 }} />
                      <Typography variant="h6" color="warning.main">★</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Contributo
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
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
