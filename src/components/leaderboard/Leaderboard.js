import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Leaderboard as LeaderboardIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { leaderboardAPI } from '../../services/api';
import { useAuth } from '../../services/AuthContext';

function Leaderboard() {
  const { currentUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [materialFilter, setMaterialFilter] = useState('all');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Material types for filtering
  const materialTypes = [
    { value: 'all', label: 'Tutti i materiali' },
    { value: 'PLASTICA', label: 'Plastica' },
    { value: 'CARTA', label: 'Carta' },
    { value: 'VETRO', label: 'Vetro' },
    { value: 'ORGANICO', label: 'Organico' },
    { value: 'INDIFFERENZIATO', label: 'Indifferenziato' },
    { value: 'METALLO', label: 'Metallo' },
    { value: 'RAEE', label: 'RAEE' }
  ];

  useEffect(() => {
    fetchLeaderboardData();
  }, [tabValue, materialFilter]);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      let response;
      
      // Fetch different leaderboard data based on selected tab and filter
      if (tabValue === 0) {
        // Global leaderboard
        if (materialFilter === 'all') {
          response = await leaderboardAPI.getGlobalLeaderboard(20);
        } else {
          response = await leaderboardAPI.getLeaderboardByMaterial(materialFilter, 20);
        }
      } else if (tabValue === 1) {
        // Weekly leaderboard
        response = await leaderboardAPI.getWeeklyLeaderboard(20);
      }
      
      if (response && response.data) {
        setLeaderboardData(response.data);
      } else {
        setLeaderboardData([]);
      }
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
      setError('Impossibile caricare i dati della classifica. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMaterialFilterChange = (event) => {
    setMaterialFilter(event.target.value);
  };

  // Function to render medal or position
  const renderPosition = (position) => {
    if (position === 0) {
      return (
        <Avatar sx={{ bgcolor: '#FFD700' }}>1</Avatar> // Gold
      );
    } else if (position === 1) {
      return (
        <Avatar sx={{ bgcolor: '#C0C0C0' }}>2</Avatar> // Silver
      );
    } else if (position === 2) {
      return (
        <Avatar sx={{ bgcolor: '#CD7F32' }}>3</Avatar> // Bronze
      );
    } else {
      return (
        <Avatar sx={{ bgcolor: 'grey.300' }}>{position + 1}</Avatar>
      );
    }
  };

  // Check if the user is in the leaderboard
  const isUserInLeaderboard = leaderboardData.some(
    item => currentUser && item.userId === currentUser.id
  );

  // Find user's position in the leaderboard
  const getUserPosition = () => {
    if (!currentUser) return -1;
    const userIndex = leaderboardData.findIndex(item => item.userId === currentUser.id);
    return userIndex;
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TrophyIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
          <Typography variant="h4" component="h1">
            Classifica
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="leaderboard tabs"
            variant="fullWidth"
          >
            <Tab 
              label="Classifica Globale" 
              icon={<LeaderboardIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Classifica Settimanale" 
              icon={<FilterIcon />} 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="material-filter-label">Filtra per materiale</InputLabel>
                  <Select
                    labelId="material-filter-label"
                    id="material-filter"
                    value={materialFilter}
                    label="Filtra per materiale"
                    onChange={handleMaterialFilterChange}
                  >
                    {materialTypes.map((material) => (
                      <MenuItem key={material.value} value={material.value}>
                        {material.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  {materialFilter === 'all' 
                    ? 'Visualizzazione di tutti i materiali' 
                    : `Filtraggio per: ${materialTypes.find(m => m.value === materialFilter)?.label}`}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : leaderboardData.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Nessun dato disponibile per questa classifica
            </Typography>
          </Box>
        ) : (
          <>
            <List>
              {leaderboardData.map((item, index) => {
                const isCurrentUser = currentUser && item.userId === currentUser.id;
                
                return (
                  <React.Fragment key={index}>
                    <ListItem 
                      className={`leaderboard-item ${index < 3 ? `user-rank-${index + 1}` : ''} ${isCurrentUser ? 'user-current' : ''}`}
                      sx={{ 
                        bgcolor: isCurrentUser ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                        borderRadius: 1
                      }}
                    >
                      <ListItemAvatar>
                        {renderPosition(index)}
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight={isCurrentUser ? 'bold' : 'normal'}>
                              {item.username}
                            </Typography>
                            {isCurrentUser && (
                              <Chip 
                                label="Tu" 
                                size="small" 
                                color="primary" 
                                sx={{ ml: 1 }} 
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {materialFilter !== 'all' 
                              ? `${item.materialCount || 0} classificazioni di ${materialTypes.find(m => m.value === materialFilter)?.label}`
                              : `${item.totalClassifications || 0} classificazioni totali`}
                          </Typography>
                        }
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          {item.ecoPoints || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          punti
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                );
              })}
            </List>

            {currentUser && !isUserInLeaderboard && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="body1" align="center">
                  Non sei ancora in classifica. Inizia a classificare i rifiuti per guadagnare punti eco!
                </Typography>
              </Box>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
}

export default Leaderboard;
