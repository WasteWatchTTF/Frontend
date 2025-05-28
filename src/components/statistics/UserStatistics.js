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
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import {
  BarChart as ChartIcon,
  EmojiEvents as AchievementsIcon,
  RecyclingRounded as RecyclingIcon,
  CheckCircle as CheckCircleIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { statisticsAPI } from '../../services/api';
import { useAuth } from '../../services/AuthContext';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function UserStatistics() {
  const { currentUser, isAuthenticated } = useAuth();
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchUserStatistics = async () => {
      if (!isAuthenticated || !currentUser) {
        setLoading(false);
        return;
      }

      try {
        const response = await statisticsAPI.getUserStatistics(currentUser.id);
        setUserStats(response.data);
      } catch (err) {
        console.error('Error fetching user statistics:', err);
        setError('Impossibile caricare le statistiche utente. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatistics();
  }, [currentUser, isAuthenticated]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Prepare data for pie chart
  const preparePieChartData = () => {
    if (!userStats || !userStats.materialDistribution) {
      return {
        labels: ['Nessun dato'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['#e0e0e0'],
          },
        ],
      };
    }

    const materialColors = {
      'PLASTICA': '#ffeb3b', // Yellow
      'CARTA': '#2196f3',    // Blue
      'VETRO': '#4caf50',    // Green
      'ORGANICO': '#795548', // Brown
      'INDIFFERENZIATO': '#9e9e9e', // Grey
      'METALLO': '#f44336',  // Red
      'RAEE': '#9c27b0',     // Purple
    };

    const labels = [];
    const data = [];
    const backgroundColor = [];

    // Convert materialDistribution object to arrays for chart
    Object.entries(userStats.materialDistribution).forEach(([material, count]) => {
      labels.push(material);
      data.push(count);
      backgroundColor.push(materialColors[material] || '#9e9e9e');
    });

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare data for bar chart (weekly activity)
  const prepareBarChartData = () => {
    if (!userStats || !userStats.weeklyActivity) {
      return {
        labels: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
        datasets: [
          {
            label: 'Classificazioni',
            data: [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(76, 175, 80, 0.6)',
          },
        ],
      };
    }

    const dayLabels = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
    const data = Array(7).fill(0);

    // Convert weeklyActivity object to array for chart
    Object.entries(userStats.weeklyActivity).forEach(([day, count]) => {
      // day is 1-7 (Monday-Sunday)
      const index = parseInt(day) - 1;
      if (index >= 0 && index < 7) {
        data[index] = count;
      }
    });

    return {
      labels: dayLabels,
      datasets: [
        {
          label: 'Classificazioni',
          data,
          backgroundColor: 'rgba(76, 175, 80, 0.6)',
          borderColor: 'rgba(76, 175, 80, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart options
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Attività settimanale',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
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
          <ChartIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Accedi per visualizzare le tue statistiche
          </Typography>
          <Typography variant="body1" paragraph>
            Per visualizzare le tue statistiche personali, devi accedere o registrarti.
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

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <ChartIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
          <Typography variant="h4" component="h1">
            Le Tue Statistiche
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!userStats ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            Non hai ancora statistiche disponibili. Inizia a classificare i rifiuti per generare statistiche!
          </Alert>
        ) : (
          <>
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <RecyclingIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="h4" color="primary">
                      {userStats.totalClassifications || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Classificazioni Totali
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="h4" color="success.main">
                      {userStats.correctClassifications || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Classificazioni Corrette
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <AchievementsIcon sx={{ fontSize: 48, mb: 1, color: '#FFD700' }} />
                    <Typography variant="h4" sx={{ color: '#FFD700' }}>
                      {userStats.ecoPoints || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Eco Punti
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <AchievementsIcon color="secondary" sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="h4" color="secondary.main">
                      {userStats.achievementsCount || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Traguardi Sbloccati
                    </Typography>
                    <Button
                      component={RouterLink}
                      to="/achievements"
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      Vedi tutti
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Level Progress */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Livello Eco
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h4" color="primary">
                    {userStats.level || 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {userStats.levelTitle || 'Principiante Eco'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={userStats.levelProgress || 0} 
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">
                      {`${Math.round(userStats.levelProgress || 0)}%`}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {`${userStats.pointsToNextLevel || 100 - (userStats.ecoPoints || 0)} punti al prossimo livello`}
                </Typography>
              </CardContent>
            </Card>

            {/* Charts Tabs */}
            <Box sx={{ width: '100%', mb: 4 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange} 
                  aria-label="statistics tabs"
                  centered
                >
                  <Tab 
                    icon={<PieChartIcon />} 
                    label="Distribuzione Materiali" 
                    id="tab-0" 
                    aria-controls="tabpanel-0" 
                  />
                  <Tab 
                    icon={<TimelineIcon />} 
                    label="Attività Settimanale" 
                    id="tab-1" 
                    aria-controls="tabpanel-1" 
                  />
                </Tabs>
              </Box>
              <Box
                role="tabpanel"
                hidden={tabValue !== 0}
                id="tabpanel-0"
                aria-labelledby="tab-0"
                sx={{ pt: 3 }}
              >
                {tabValue === 0 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Box sx={{ height: 300 }}>
                        <Pie data={preparePieChartData()} options={pieChartOptions} />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="h6" gutterBottom>
                        Distribuzione Materiali
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Questa visualizzazione mostra la distribuzione dei materiali che hai classificato finora.
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body2">
                        Materiale più classificato:
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {userStats.topMaterial || 'Nessuno'}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </Box>
              <Box
                role="tabpanel"
                hidden={tabValue !== 1}
                id="tabpanel-1"
                aria-labelledby="tab-1"
                sx={{ pt: 3 }}
              >
                {tabValue === 1 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Box sx={{ height: 300 }}>
                        <Bar data={prepareBarChartData()} options={barChartOptions} />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="h6" gutterBottom>
                        Attività Settimanale
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Questo grafico mostra il numero di classificazioni che hai effettuato in ogni giorno della settimana.
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body2">
                        Giorno più attivo:
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {userStats.mostActiveDay || 'Nessuno'}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        Media giornaliera:
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {userStats.dailyAverage?.toFixed(1) || '0'} classificazioni
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Box>

            {/* Recent Achievements */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Traguardi Recenti
              </Typography>
              {userStats.recentAchievements && userStats.recentAchievements.length > 0 ? (
                <Grid container spacing={2}>
                  {userStats.recentAchievements.slice(0, 3).map((achievement, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <Card className="achievement-card">
                        <CardContent sx={{ textAlign: 'center' }}>
                          <AchievementsIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
                          <Typography variant="h6" gutterBottom>
                            {achievement.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {achievement.description}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, color: '#FFD700' }}>
                            +{achievement.bonusEcoPoints} punti eco
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Non hai ancora sbloccato nessun traguardo. Continua a classificare i rifiuti per sbloccare traguardi!
                </Typography>
              )}
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button
                  component={RouterLink}
                  to="/achievements"
                  color="primary"
                  endIcon={<AchievementsIcon />}
                >
                  Vedi tutti i traguardi
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default UserStatistics;
