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
  Tab
} from '@mui/material';
import {
  EmojiEvents as AchievementsIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { statisticsAPI } from '../../services/api';
import { useAuth } from '../../services/AuthContext';

function AchievementsList() {
  const { currentUser, isAuthenticated } = useAuth();
  const [achievements, setAchievements] = useState([]);
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
        const response = await statisticsAPI.getUserAchievements(currentUser.id);
        setAchievements(response.data);
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError('Impossibile caricare i traguardi. Riprova più tardi.');
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
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {achievement.secret && !achievement.unlocked 
                            ? 'Questo traguardo è segreto. Continua a giocare per scoprirlo!' 
                            : achievement.description}
                        </Typography>
                        
                        {achievement.unlocked && (
                          <Typography variant="body2" sx={{ color: '#FFD700' }}>
                            +{achievement.bonusEcoPoints} punti eco
                          </Typography>
                        )}
                        
                        {!achievement.unlocked && !achievement.secret && achievement.activationConditionType && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Requisito: {achievement.activationConditionType} {achievement.activationConditionValue}
                            </Typography>
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
