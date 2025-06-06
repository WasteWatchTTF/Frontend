import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Avatar,
  Chip,
  Divider,
  Card,
  CardContent,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Snackbar,
  Alert,
  Skeleton,
  Fade,
  Slide,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  DateRange as DateIcon,
  EmojiEvents as TrophyIcon,
  TrendingUp as StatsIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  Verified as VerifiedIcon,
  PhotoCamera as CameraIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  Badge as BadgeIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useAuth } from '../../services/AuthContext';
import { useTheme as useCustomTheme } from '../../services/ThemeContext';
import api, { badgeAPI } from '../../services/api';

const UserProfile = () => {
  const theme = useTheme();
  const { darkMode } = useCustomTheme();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [badgeDialogOpen, setBadgeDialogOpen] = useState(false);
  const [badgePreview, setBadgePreview] = useState(null);
  const [badgeLoading, setBadgeLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Form states
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      setProfile(response.data);
      setEditForm({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        email: response.data.email || '',
      });
    } catch (error) {
      console.error('Errore nel caricamento del profilo:', error);
      showSnackbar('Errore nel caricamento del profilo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async () => {
    try {
      setFormErrors({});
      await api.put('/user/profile', editForm);
      setEditDialogOpen(false);
      fetchProfile();
      showSnackbar('Profilo aggiornato con successo!', 'success');
    } catch (error) {
      console.error('Errore nell\'aggiornamento del profilo:', error);
      showSnackbar(error.response?.data || 'Errore nell\'aggiornamento del profilo', 'error');
    }
  };

  const handleChangePassword = async () => {
    try {
      setFormErrors({});
      
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setFormErrors({ confirmPassword: 'Le password non coincidono' });
        return;
      }
      
      if (passwordForm.newPassword.length < 8) {
        setFormErrors({ newPassword: 'La password deve essere lunga almeno 8 caratteri' });
        return;
      }

      await api.post('/user/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      
      setPasswordDialogOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showSnackbar('Password cambiata con successo!', 'success');
    } catch (error) {
      console.error('Errore nel cambio password:', error);
      showSnackbar(error.response?.data || 'Errore nel cambio password', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getLevelColor = (level) => {
    if (level >= 10) return '#ffd700'; // Gold
    if (level >= 5) return '#c0c0c0'; // Silver
    return '#cd7f32'; // Bronze
  };

  const getInitials = (firstName, lastName, username) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return username ? username.substring(0, 2).toUpperCase() : 'U';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data non disponibile';
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Data non valida';
      }
      
      return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Data non disponibile';
    }
  };

  const generateBadge = async () => {
    setBadgeDialogOpen(true);
    setBadgeLoading(true);
    
    try {
      // Carica l'anteprima del badge
      const previewResponse = await badgeAPI.previewBadge();
      setBadgePreview(previewResponse.data);
    } catch (error) {
      console.error('Errore nel caricamento anteprima badge:', error);
      showSnackbar('Errore nel caricamento anteprima badge', 'error');
    } finally {
      setBadgeLoading(false);
    }
  };

  const downloadBadge = async () => {
    setBadgeLoading(true);
    
    try {
      const response = await badgeAPI.generateBadge();
      
      // Crea un blob URL per il download del PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Crea un link temporaneo per il download
      const link = document.createElement('a');
      link.href = url;
      link.download = `wastewatch-badge-${profile.username}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setBadgeDialogOpen(false);
      showSnackbar('Badge scaricato con successo!', 'success');
    } catch (error) {
      console.error('Errore nella generazione del badge:', error);
      showSnackbar('Errore nella generazione del badge', 'error');
    } finally {
      setBadgeLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Skeleton variant="circular" width={120} height={120} />
                <Skeleton variant="text" width={150} height={40} sx={{ mt: 2 }} />
                <Skeleton variant="text" width={200} height={20} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Skeleton variant="text" width={200} height={40} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="80%" height={20} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6" color="error">
            Errore nel caricamento del profilo
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box>
          {/* Header Section */}
          <Paper
            elevation={3}
            sx={{
              p: 4,
              mb: 3,
              borderRadius: 4,
              background: darkMode
                ? 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)'
                : 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                animation: 'float 6s ease-in-out infinite',
              },
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-20px)' },
              },
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: 48,
                    fontWeight: 'bold',
                    bgcolor: 'secondary.main',
                    color: 'white',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                    border: '4px solid rgba(255,255,255,0.3)',
                  }}
                >
                  {getInitials(profile.firstName, profile.lastName, profile.username)}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {profile.firstName && profile.lastName
                    ? `${profile.firstName} ${profile.lastName}`
                    : profile.username}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                  @{profile.username}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<VerifiedIcon />}
                    label={`Livello ${profile.level || 1}`}
                    sx={{
                      bgcolor: getLevelColor(profile.level || 1),
                      color: 'black',
                      fontWeight: 'bold',
                    }}
                  />
                  <Chip
                    icon={<StarIcon />}
                    label={`${profile.points || 0} punti`}
                    variant="outlined"
                    sx={{ color: 'white', borderColor: 'white' }}
                  />
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setEditDialogOpen(true)}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                    }}
                  >
                    Modifica Profilo
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<BadgeIcon />}
                    onClick={generateBadge}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.5)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      '&:hover': { 
                        borderColor: 'rgba(255,255,255,0.8)',
                        bgcolor: 'rgba(255,255,255,0.1)' 
                      },
                    }}
                  >
                    Crea Badge
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Grid container spacing={3}>
            {/* Left Column - Personal Info */}
            <Grid item xs={12} md={4}>
              <Slide direction="right" in={true} timeout={600}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Informazioni Personali
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Nome utente
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {profile.username}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Email
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1" fontWeight="medium">
                        {profile.email}
                      </Typography>
                    </Box>
                  </Box>

                  {(profile.firstName || profile.lastName) && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Nome completo
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {`${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Non specificato'}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Membro dal
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DateIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1" fontWeight="medium">
                        {formatDate(profile.registrationDate)}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<LockIcon />}
                    onClick={() => setPasswordDialogOpen(true)}
                    sx={{ mt: 2 }}
                  >
                    Cambia Password
                  </Button>
                </Paper>
              </Slide>
            </Grid>

            {/* Right Column - Statistics */}
            <Grid item xs={12} md={8}>
              <Slide direction="left" in={true} timeout={800}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <StatsIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Statistiche
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <CameraIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                          <Typography variant="h4" fontWeight="bold" color="primary.main">
                            {profile.totalClassifications || 0}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Classificazioni Totali
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <CheckIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                          <Typography variant="h4" fontWeight="bold" color="success.main">
                            {profile.correctClassifications || 0}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Classificazioni Corrette
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <StarIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                          <Typography variant="h4" fontWeight="bold" color="warning.main">
                            {profile.points || 0}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Punti Totali
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <TrophyIcon sx={{ fontSize: 40, color: getLevelColor(profile.level || 1), mb: 1 }} />
                          <Typography 
                            variant="h4" 
                            fontWeight="bold" 
                            sx={{ color: getLevelColor(profile.level || 1) }}
                          >
                            {profile.level || 1}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Livello Attuale
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Accuracy Percentage */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body1" fontWeight="medium" gutterBottom>
                      Precisione: {profile.totalClassifications > 0 
                        ? ((profile.correctClassifications / profile.totalClassifications) * 100).toFixed(1)
                        : 0}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={profile.totalClassifications > 0 
                        ? (profile.correctClassifications / profile.totalClassifications) * 100
                        : 0}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)',
                        },
                      }}
                    />
                  </Box>

                  {/* Level Progress */}
                  {profile.nextLevelRequiredPoints && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body1" fontWeight="medium" gutterBottom>
                        Progresso Livello: {profile.currentLevelProgress || 0} / {profile.nextLevelRequiredPoints} punti
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={((profile.currentLevelProgress || 0) / profile.nextLevelRequiredPoints) * 100}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: `linear-gradient(90deg, ${getLevelColor(profile.level || 1)} 0%, ${getLevelColor(profile.level + 1 || 2)} 100%)`,
                          },
                        }}
                      />
                    </Box>
                  )}
                </Paper>
              </Slide>
            </Grid>
          </Grid>
        </Box>
      </Fade>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifica Profilo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            variant="outlined"
            value={editForm.firstName}
            onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
            error={!!formErrors.firstName}
            helperText={formErrors.firstName}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Cognome"
            fullWidth
            variant="outlined"
            value={editForm.lastName}
            onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
            error={!!formErrors.lastName}
            helperText={formErrors.lastName}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annulla</Button>
          <Button onClick={handleEditProfile} variant="contained">Salva</Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cambia Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Password Attuale"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            error={!!formErrors.currentPassword}
            helperText={formErrors.currentPassword}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Nuova Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            error={!!formErrors.newPassword}
            helperText={formErrors.newPassword}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Conferma Nuova Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            error={!!formErrors.confirmPassword}
            helperText={formErrors.confirmPassword}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Annulla</Button>
          <Button onClick={handleChangePassword} variant="contained">Cambia Password</Button>
        </DialogActions>
      </Dialog>

      {/* Badge Creation Dialog */}
      <Dialog open={badgeDialogOpen} onClose={() => setBadgeDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BadgeIcon color="primary" />
            <Typography variant="h6">Crea il tuo Badge WasteWatch</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="body1" color="text.secondary" paragraph>
              Crea un badge personalizzato come un "passaporto digitale" che mostra i tuoi risultati e 
              progressi in WasteWatch. Potrai condividerlo sui social o usarlo come biglietto da visita ecologico!
            </Typography>
            
            <Paper elevation={2} sx={{ p: 3, mt: 3, borderRadius: 2, bgcolor: 'background.default' }}>
              <Typography variant="h6" gutterBottom>Anteprima Badge</Typography>
              {badgeLoading ? (
                <Box 
                  sx={{ 
                    border: '2px dashed', 
                    borderColor: 'grey.300', 
                    borderRadius: 2, 
                    p: 4, 
                    textAlign: 'center',
                    bgcolor: 'grey.50'
                  }}
                >
                  <CircularProgress sx={{ mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Caricamento anteprima...
                  </Typography>
                </Box>
              ) : badgePreview ? (
                <Box 
                  sx={{ 
                    borderRadius: 4, 
                    p: 0,
                    position: 'relative',
                    background: darkMode 
                      ? 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #4caf50 100%)'
                      : 'linear-gradient(135deg, #4caf50 0%, #66bb6a 50%, #81c784 100%)',
                    color: 'white',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '-50%',
                      right: '-20%',
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      animation: 'float 8s ease-in-out infinite',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-30%',
                      left: '-10%',
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      animation: 'float 6s ease-in-out infinite reverse',
                    },
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                      '50%': { transform: 'translateY(-20px) rotate(10deg)' },
                    },
                  }}
                >
                  {/* Header */}
                  <Box sx={{ p: 3, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                      🌱 WasteWatch Eco Badge
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.875rem' }}>
                      PASSAPORTO ECOLOGICO DIGITALE
                    </Typography>
                  </Box>

                  {/* Profile Section */}
                  <Box sx={{ 
                    px: 3, 
                    pb: 2,
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <Box sx={{ 
                      background: 'linear-gradient(45deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                      color: '#2e7d32', 
                      borderRadius: '50%', 
                      width: 80, 
                      height: 80, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: 32,
                      fontWeight: 'bold',
                      mr: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                      border: '3px solid rgba(255,255,255,0.3)'
                    }}>
                      {getInitials(profile.firstName, profile.lastName, profile.username)}
                    </Box>
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="h5" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                        {badgePreview.displayName}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1rem' }}>
                        @{badgePreview.username}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Stats Grid */}
                  <Box sx={{ 
                    background: 'rgba(255,255,255,0.15)', 
                    backdropFilter: 'blur(10px)',
                    mx: 2,
                    mb: 2,
                    borderRadius: 3,
                    p: 2.5,
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            mb: 0.5
                          }}>
                            <TrophyIcon sx={{ fontSize: 20, mr: 0.5, color: '#ffd700' }} />
                            <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                              Livello
                            </Typography>
                          </Box>
                          <Typography variant="h4" fontWeight="bold" sx={{ 
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            background: 'linear-gradient(45deg, #ffd700, #ffeb3b)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}>
                            {badgePreview.level}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            mb: 0.5
                          }}>
                            <StarIcon sx={{ fontSize: 20, mr: 0.5, color: '#ffeb3b' }} />
                            <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                              Punti
                            </Typography>
                          </Box>
                          <Typography variant="h4" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                            {badgePreview.points}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            mb: 0.5
                          }}>
                            <CameraIcon sx={{ fontSize: 20, mr: 0.5, color: '#e3f2fd' }} />
                            <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                              Classificazioni
                            </Typography>
                          </Box>
                          <Typography variant="h4" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                            {badgePreview.totalClassifications}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            mb: 0.5
                          }}>
                            <CheckIcon sx={{ fontSize: 20, mr: 0.5, color: '#c8e6c9' }} />
                            <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                              Precisione
                            </Typography>
                          </Box>
                          <Typography variant="h4" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                            {badgePreview.accuracy.toFixed(1)}%
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  {/* Footer */}
                  <Box sx={{ 
                    textAlign: 'center', 
                    pb: 3, 
                    px: 3,
                    position: 'relative',
                    zIndex: 1 
                  }}>
                    <Typography variant="body2" sx={{ 
                      opacity: 0.8, 
                      fontStyle: 'italic',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}>
                      Eco-Warrior dal {badgePreview.memberSince}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      opacity: 0.7,
                      display: 'block',
                      mt: 0.5,
                      fontSize: '0.75rem'
                    }}>
                      🌍 Insieme per un futuro più verde
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box 
                  sx={{ 
                    border: '2px dashed', 
                    borderColor: 'grey.300', 
                    borderRadius: 2, 
                    p: 4, 
                    textAlign: 'center',
                    bgcolor: 'grey.50'
                  }}
                >
                  <BadgeIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Carica l'anteprima del badge
                  </Typography>
                </Box>
              )}
            </Paper>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Il tuo badge includerà:
              </Typography>
              <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  Nome utente e livello raggiunto
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  Statistiche delle classificazioni
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  Punti totali e precisione
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  Data di registrazione e tempo attivo
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setBadgeDialogOpen(false)}
            disabled={badgeLoading}
          >
            Annulla
          </Button>
          <Button 
            onClick={downloadBadge} 
            variant="contained" 
            disabled={badgeLoading || !badgePreview}
            startIcon={badgeLoading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
            sx={{ 
              background: 'linear-gradient(45deg, #4caf50 30%, #2e7d32 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #45a049 30%, #1b5e20 90%)',
              },
              '&:disabled': {
                background: 'rgba(0, 0, 0, 0.12)',
              }
            }}
          >
            {badgeLoading ? 'Generando...' : 'Scarica Badge PDF'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserProfile; 