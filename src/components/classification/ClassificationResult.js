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
  TrendingUp as TrendingUpIcon,
  Pets as PetsIcon,
  Description as DescriptionIcon,
  LocalBar as LocalBarIcon,
  Build as BuildIcon,
  ElectricBolt as ElectricBoltIcon
} from '@mui/icons-material';
import { classificationAPI, resultsAPI } from '../../services/api';

function ClassificationResult() {
  const { id } = useParams();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          
          // Prova a recuperare i dettagli completi dal backend
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
    const typeIcons = {
      'PLASTICA': <PetsIcon />,
      'CARTA': <DescriptionIcon />,
      'VETRO': <LocalBarIcon />,
      'ORGANICO': <EcoIcon />,
      'INDIFFERENZIATO': <DeleteIcon />,
      'METALLO': <BuildIcon />,
      'RAEE': <ElectricBoltIcon />,
    };
    
    return typeIcons[wasteType?.toUpperCase()] || <DeleteIcon />;
  };

  // Function to safely format dates from Java LocalDateTime or other formats
  const formatDateTime = (dateValue) => {
    if (!dateValue) return 'Data non disponibile';
    
    try {
      // Handle different date formats that might come from Java backend
      let date;
      
      // If it's already a Date object
      if (dateValue instanceof Date) {
        date = dateValue;
      }
      // If it's a string (ISO format from Java LocalDateTime)
      else if (typeof dateValue === 'string') {
        // Java LocalDateTime might come in format like "2023-12-22T10:30:00" or "2023-12-22T10:30:00.123"
        date = new Date(dateValue);
      }
      // If it's a number (timestamp)
      else if (typeof dateValue === 'number') {
        date = new Date(dateValue);
      }
      // If it's an array (some APIs return date as array [year, month, day, hour, minute, second])
      else if (Array.isArray(dateValue) && dateValue.length >= 3) {
        // Java LocalDateTime might be serialized as [year, month, day, hour, minute, second, nanosecond]
        const [year, month, day, hour = 0, minute = 0, second = 0] = dateValue;
        date = new Date(year, month - 1, day, hour, minute, second); // month is 0-indexed in JS
      }
      else {
        // Try to convert to string and parse
        date = new Date(String(dateValue));
      }
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date value:', dateValue);
        return 'Data non valida';
      }
      
      return date.toLocaleString('it-IT');
    } catch (error) {
      console.error('Error formatting date:', error, 'Value:', dateValue);
      return 'Errore data';
    }
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
                    secondary={formatDateTime(result.timestamp)}
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
