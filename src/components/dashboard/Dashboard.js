import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip
} from '@mui/material';
import {
  PhotoCamera as CameraIcon,
  Leaderboard as LeaderboardIcon,
  EmojiEvents as AchievementsIcon,
  BarChart as StatsIcon,
  RecyclingRounded as RecyclingIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useAuth } from '../../services/AuthContext';
import { statisticsAPI, resultsAPI } from '../../services/api';

function Dashboard() {
  const { currentUser, isAuthenticated } = useAuth();
  const [userStats, setUserStats] = useState(null);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Wait for currentUser to be populated and ensure id is present
      if (!isAuthenticated || !currentUser || !currentUser.id) {
        setLoading(false);
        return;
      }

      setLoading(true); // Set loading to true before fetchin g 
      setError(''); // Clear previous errors

      try { 
        // Fetch user statistics
        let statsData = null;
        try {
          const statsResponse = await statisticsAPI.getUserStatistics(currentUser.id);
          statsData = statsResponse.data;
        } catch (statsErr) {
          console.log('Statistiche non disponibili per utente nuovo:', statsErr);
          // Se le statistiche non sono disponibili, usiamo valori di default
          statsData = {
            totalClassifications: 0,
            correctClassifications: 0,
            ecoPoints: 0,
            achievementsCount: 0
          };
        }
        setUserStats(statsData);

        // Fetch recent classification results
        let resultsData = [];
        try {
          const resultsResponse = await resultsAPI.getUserResults(currentUser.id, 0, 5);
          resultsData = resultsResponse.data.content || [];
        } catch (resultsErr) {
          console.log('Risultati non disponibili per utente nuovo:', resultsErr);
          // Se i risultati non sono disponibili, usiamo un array vuoto
          resultsData = [];
        }
        setRecentResults(resultsData);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        // Se abbiamo un errore generale, impostiamo valori di default invece di mostrare errore
        setUserStats({
          totalClassifications: 0,
          correctClassifications: 0,
          ecoPoints: 0,
          achievementsCount: 0
        });
        setRecentResults([]);
        
        // Solo per errori gravi mostriamo un messaggio di errore
        if (err.response && err.response.status >= 500) {
          setError('Servizio temporaneamente non disponibile. I tuoi dati verranno caricati non appena il servizio sarà ripristinato.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, isAuthenticated]);

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isAuthenticated 
            ? `Benvenuto, ${currentUser.username}!` 
            : 'Benvenuto su WasteWatch!'}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Riconosci e smaltisci correttamente i rifiuti con l'aiuto dell'intelligenza artificiale.
        </Typography>
      </Box>

      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.light' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Azioni Rapide
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  component={RouterLink}
                  to="/classification"
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<CameraIcon />}
                  sx={{ py: 2 }}
                >
                  Classifica Rifiuto
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  component={RouterLink}
                  to="/leaderboard"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<LeaderboardIcon />}
                  sx={{ py: 2 }}
                >
                  Classifica
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  component={RouterLink}
                  to="/statistics"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<StatsIcon />}
                  sx={{ py: 2 }}
                >
                  Statistiche
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  component={RouterLink}
                  to="/achievements"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<AchievementsIcon />}
                  sx={{ py: 2 }}
                >
                  Traguardi
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {isAuthenticated ? (
          <>
            {/* User Statistics */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Le Tue Statistiche
                </Typography>
                {userStats && userStats.totalClassifications > 0 ? (
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                        <CardContent>
                          <Typography variant="h4" color="primary">
                            {userStats.totalClassifications || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Classificazioni Totali
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                        <CardContent>
                          <Typography variant="h4" color="primary">
                            {userStats.ecoPoints || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Eco Punti
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                        <CardContent>
                          <Typography variant="h4" color="primary">
                            {userStats.correctClassifications || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Classificazioni Corrette
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                        <CardContent>
                          <Typography variant="h4" color="primary">
                            {userStats.achievementsCount || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Traguardi Sbloccati
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                ) : userStats && userStats.totalClassifications === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <RecyclingIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="subtitle1" color="text.secondary">
                      Non hai ancora effettuato nessuna classificazione.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Inizia a classificare i tuoi rifiuti per vedere le tue statistiche!
                    </Typography>
                    <Button
                      component={RouterLink}
                      to="/classification"
                      variant="contained"
                      color="primary"
                      startIcon={<CameraIcon />}
                    >
                      Classifica Ora
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                     {/* Questo box verrà mostrato se userStats è null o undefined, 
                         gestito anche dal messaggio di errore generale se presente */}
                    <Typography variant="subtitle1" color="text.secondary">
                      Statistiche non disponibili al momento.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Recent Classifications */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Classificazioni Recenti
                </Typography>
                {recentResults.length > 0 ? (
                  <List>
                    {recentResults.map((result) => (
                      <React.Fragment key={result.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: getWasteTypeColor(result.identifiedMaterial) }}>
                              <RecyclingIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={result.identifiedMaterial}
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {new Date(result.timestamp).toLocaleDateString()} - 
                                </Typography>
                                {` ${result.municipality || 'Default'}`}
                                <Box sx={{ mt: 1 }}>
                                  <Chip 
                                    size="small" 
                                    icon={<CheckCircleIcon />} 
                                    label={`${Math.round(result.confidence * 100)}% confidenza`}
                                    color="primary"
                                    variant="outlined"
                                  />
                                </Box>
                              </>
                            }
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Nessuna classificazione recente. Inizia a classificare i rifiuti!
                  </Typography>
                )}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    component={RouterLink} 
                    to="/classification" 
                    color="primary"
                  >
                    Classifica un nuovo rifiuto
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </>
        ) : (
          // Content for non-authenticated users
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Box sx={{ my: 3 }}>
                <RecyclingIcon color="primary" sx={{ fontSize: 80 }} />
              </Box>
              <Typography variant="h5" gutterBottom>
                Inizia a classificare i tuoi rifiuti!
              </Typography>
              <Typography variant="body1" paragraph>
                Accedi o registrati per tenere traccia delle tue classificazioni, guadagnare punti eco e sbloccare traguardi.
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  color="primary"
                  sx={{ mx: 1 }}
                >
                  Accedi
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="outlined"
                  color="primary"
                  sx={{ mx: 1 }}
                >
                  Registrati
                </Button>
              </Box>
            </Paper>
          </Grid>
        )}

        {/* How It Works */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Come Funziona
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <CameraIcon color="primary" sx={{ fontSize: 48 }} />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      1. Scatta una foto
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Scatta una foto del rifiuto che vuoi classificare o carica un'immagine dalla galleria.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <RecyclingIcon color="primary" sx={{ fontSize: 48 }} />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      2. Ottieni la classificazione
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      L'intelligenza artificiale analizzerà l'immagine e ti dirà di che tipo di rifiuto si tratta.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <CheckCircleIcon color="primary" sx={{ fontSize: 48 }} />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      3. Smaltisci correttamente
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ricevi istruzioni precise su come smaltire correttamente il rifiuto in base alle regole del tuo comune.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
