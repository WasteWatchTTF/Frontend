import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import {
  EmojiEvents as AchievementsIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { achievementAPI } from '../../services/api';
import { useAuth } from '../../services/AuthContext';
import { statisticsAPI } from '../../services/api';

function AchievementsList() {
  const { currentUser, isAuthenticated } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!isAuthenticated || !currentUser) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching achievements for user:', currentUser.id);
        
        // Recupera tutti gli achievement disponibili
        const availableResponse = await achievementAPI.getAvailableAchievements();
        console.log('Available achievements response:', availableResponse);
        
        const allAchievements = availableResponse.data || [];
        console.log('All achievements:', allAchievements);
        
        // Se non ci sono achievements disponibili, prova a inizializzarli
        if (allAchievements.length === 0) {
          console.log('No achievements found, trying to initialize...');
          try {
            const initResponse = await achievementAPI.initializeAchievements();
            console.log('Achievement initialization response:', initResponse);
            
            // Riprova a recuperare gli achievement dopo l'inizializzazione
            const retryResponse = await achievementAPI.getAvailableAchievements();
            const retryAchievements = retryResponse.data || [];
            console.log('Achievements after initialization:', retryAchievements);
            
            setAchievements(retryAchievements.map(achievement => ({
              ...achievement,
              unlocked: false,
              unlockedAt: null
            })));
            setUserAchievements([]);
            setLoading(false);
            return;
          } catch (initErr) {
            console.error('Error initializing achievements:', initErr);
            setError('Impossibile inizializzare i traguardi. Verifica che il server sia accessibile.');
            setLoading(false);
            return;
          }
        }
        
        // Recupera gli achievement dell'utente
        const userResponse = await achievementAPI.getUserAchievements(currentUser.id);
        console.log('User achievements response:', userResponse);
        
        const userAchievementsList = userResponse.data || [];
        console.log('User achievements:', userAchievementsList);
        
        // Crea una mappa degli achievement sbloccati dall'utente
        const unlockedAchievementIds = new Set(
          userAchievementsList.map(ua => ua.achievement?.id || ua.achievementId)
        );
        
        console.log('Unlocked achievement IDs:', Array.from(unlockedAchievementIds));
        
        // Combina gli achievement disponibili con lo stato di sblocco dell'utente
        const combinedAchievements = allAchievements.map(achievement => ({
          ...achievement,
          unlocked: unlockedAchievementIds.has(achievement.id),
          unlockedAt: userAchievementsList.find(ua => 
            (ua.achievement?.id || ua.achievementId) === achievement.id
          )?.unlockedAt || null
        }));
        
        console.log('Combined achievements:', combinedAchievements);
        
        setAchievements(combinedAchievements);
        setUserAchievements(userAchievementsList);
        
        // Recupera anche le statistiche dell'utente per mostrare il progresso
        try {
          const statsResponse = await statisticsAPI.getUserStatistics(currentUser.id);
          console.log('User statistics:', statsResponse.data);
          setUserStats(statsResponse.data);
        } catch (statsErr) {
          console.warn('Could not fetch user statistics:', statsErr);
        }
      } catch (err) {
        console.error('Error fetching achievements:', err);
        
        // Gestione errori più specifica
        if (err.response) {
          console.error('Response error:', err.response.status, err.response.data);
          if (err.response.status === 401) {
            setError('Devi essere autenticato per visualizzare i traguardi.');
          } else if (err.response.status === 404) {
            setError('Servizio traguardi non disponibile.');
          } else if (err.response.status >= 500) {
            setError('Errore del server. Riprova più tardi.');
          } else {
            setError(`Errore ${err.response.status}: ${err.response.data?.message || 'Impossibile caricare i traguardi'}`);
          }
        } else if (err.request) {
          console.error('Request error:', err.request);
          setError('Impossibile contattare il server. Verifica la tua connessione internet.');
        } else {
          console.error('General error:', err.message);
          setError('Errore inaspettato durante il caricamento dei traguardi.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [currentUser, isAuthenticated]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter achievements based on selected tab
  const getFilteredAchievements = () => {
    if (!achievements || achievements.length === 0) {
      return [];
    }

    switch (tabValue) {
      case 0: // All achievements
        return achievements;
      case 1: // Unlocked achievements
        return achievements.filter(achievement => achievement.unlocked);
      case 2: // Locked achievements
        return achievements.filter(achievement => !achievement.unlocked);
      default:
        return achievements;
    }
  };

  // Group achievements by category
  const getGroupedAchievements = () => {
    const filtered = getFilteredAchievements();
    const grouped = {};

    filtered.forEach(achievement => {
      const category = achievement.category || 'Altro';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(achievement);
    });

    return grouped;
  };

  // Function to convert technical requirements to user-friendly descriptions
  const getRequirementDescription = (achievement) => {
    if (achievement.secret && !achievement.unlocked) {
      return "Continua a classificare per scoprire questo traguardo segreto!";
    }

    const conditionType = achievement.activationConditionType;
    const conditionValue = achievement.activationConditionValue;

    switch (conditionType) {
      case 'FIRST_CLASSIFICATION':
        return "Classifica il tuo primo rifiuto";
      
      case 'TOTAL_CLASSIFICATIONS':
        return `Raggiungi ${conditionValue} classificazioni totali`;
      
      case 'TOTAL_ECO_POINTS':
        return `Accumula ${conditionValue} punti eco`;
      
      case 'CATEGORY_CLASSIFICATIONS':
        if (conditionValue && conditionValue.includes(':')) {
          const [category, count] = conditionValue.split(':');
          const categoryNames = {
            'PLASTICA': 'plastica',
            'CARTA': 'carta', 
            'VETRO': 'vetro',
            'ORGANICO': 'organico',
            'METALLO': 'metallo',
            'INDIFFERENZIATO': 'indifferenziato'
          };
          const categoryName = categoryNames[category] || category.toLowerCase();
          return `Classifica ${count} oggetti di ${categoryName}`;
        }
        return "Classificazione per categoria specifica";
      
      case 'STREAK_DAYS':
        return `Classifica per ${conditionValue} giorni consecutivi`;
      
      default:
        return "Requisito speciale - continua a giocare!";
    }
  };

  // Function to get progress percentage for an achievement
  const getProgressPercentage = (achievement, userStats) => {
    if (achievement.unlocked) return 100;
    if (!userStats) return 0;

    const conditionType = achievement.activationConditionType;
    const conditionValue = achievement.activationConditionValue;

    switch (conditionType) {
      case 'FIRST_CLASSIFICATION':
        return userStats.totalClassifications > 0 ? 100 : 0;
      
      case 'TOTAL_CLASSIFICATIONS':
        const target = parseInt(conditionValue);
        return Math.min(100, (userStats.totalClassifications / target) * 100);
      
      case 'TOTAL_ECO_POINTS':
        const pointsTarget = parseInt(conditionValue);
        return Math.min(100, (userStats.ecoPoints / pointsTarget) * 100);
      
      case 'CATEGORY_CLASSIFICATIONS':
        if (conditionValue && conditionValue.includes(':')) {
          const [category, count] = conditionValue.split(':');
          const userCategoryCount = userStats.materialDistribution?.[category] || 0;
          return Math.min(100, (userCategoryCount / parseInt(count)) * 100);
        }
        return 0;
      
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 4, textAlign: 'center', my: 4 }}>
          <AchievementsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Accedi per visualizzare i tuoi traguardi
          </Typography>
          <Typography variant="body1" paragraph>
            Per visualizzare i tuoi traguardi, devi accedere o registrarti.
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
      </Container>
    );
  }

  const groupedAchievements = getGroupedAchievements();
  const totalUnlocked = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;
  const progressPercentage = totalAchievements > 0 ? (totalUnlocked / totalAchievements) * 100 : 0;

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AchievementsIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
          <Typography variant="h4" component="h1">
            I Tuoi Traguardi
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Achievement Progress */}
        <Box sx={{ mb: 4, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Progresso Traguardi
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Hai sbloccato {totalUnlocked} traguardi su {totalAchievements} disponibili.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: '100%',
                    height: 10,
                    bgcolor: 'grey.300',
                    borderRadius: 5,
                    mr: 1,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: `${progressPercentage}%`,
                      height: '100%',
                      bgcolor: 'primary.main',
                      borderRadius: 5,
                      transition: 'width 1s ease-in-out',
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(progressPercentage)}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {totalUnlocked}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sbloccati
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="text.secondary">
                    {totalAchievements - totalUnlocked}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Da sbloccare
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="secondary.main">
                    {achievements.reduce((total, a) => total + (a.unlocked ? a.bonusEcoPoints : 0), 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Punti Eco
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Filter Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="achievement tabs"
            centered
          >
            <Tab label={`Tutti (${achievements.length})`} />
            <Tab label={`Sbloccati (${totalUnlocked})`} />
            <Tab label={`Da sbloccare (${totalAchievements - totalUnlocked})`} />
          </Tabs>
        </Box>

        {/* Achievement Cards by Category */}
        {Object.keys(groupedAchievements).length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Nessun traguardo disponibile in questa categoria
            </Typography>
          </Box>
        ) : (
          Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
            <Box key={category} sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                {category}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={3}>
                {categoryAchievements.map((achievement, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card 
                      className="achievement-card" 
                      sx={{ 
                        height: '100%',
                        bgcolor: achievement.unlocked ? 'background.paper' : 'background.default',
                        opacity: achievement.unlocked ? 1 : (achievement.secret ? 0.7 : 0.9),
                        position: 'relative',
                        overflow: 'hidden',
                        ...(achievement.unlocked && {
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '4px',
                            background: 'linear-gradient(90deg, #4caf50, #2196f3)',
                          }
                        })
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center' }}>
                        {achievement.unlocked ? (
                          <AchievementsIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
                        ) : (
                          <LockIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                        )}
                        
                        <Typography variant="h6" gutterBottom>
                          {achievement.secret && !achievement.unlocked ? '???' : achievement.name}
                        </Typography>
                        
                        {achievement.unlocked && (
                          <Chip 
                            icon={<CheckCircleIcon />} 
                            label="Sbloccato" 
                            color="success" 
                            size="small" 
                            sx={{ mb: 1 }} 
                          />
                        )}
                        
                        {achievement.unlocked && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {achievement.secret && !achievement.unlocked 
                              ? 'Questo traguardo è segreto. Continua a giocare per scoprirlo!' 
                              : achievement.description}
                          </Typography>
                        )}
                        
                        {achievement.unlocked && (
                          <Typography variant="body2" sx={{ color: '#FFD700' }}>
                            +{achievement.bonusEcoPoints} punti eco
                          </Typography>
                        )}
                        
                        {!achievement.unlocked && !achievement.secret && achievement.activationConditionType && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Come ottenerlo: {getRequirementDescription(achievement)}
                            </Typography>
                            {!achievement.unlocked && userStats && (
                              <Box sx={{ mt: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Box sx={{ width: '100%', mr: 1 }}>
                                    <LinearProgress 
                                      variant="determinate" 
                                      value={getProgressPercentage(achievement, userStats)} 
                                      sx={{ height: 6, borderRadius: 3 }}
                                    />
                                  </Box>
                                  <Box sx={{ minWidth: 35 }}>
                                    <Typography variant="caption" color="text.secondary">
                                      {Math.round(getProgressPercentage(achievement, userStats))}%
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        )}
      </Paper>
    </Container>
  );
}

export default AchievementsList;
