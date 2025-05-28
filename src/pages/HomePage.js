import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Paper,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  RecyclingTwoTone as RecyclingIcon,
  CheckCircleOutline as CheckIcon,
  EmojiEvents as TrophyIcon,
  Nature as NatureIcon,
  BarChart as StatsIcon,
  PhotoCamera as CameraIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Componenti stilizzati
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundImage: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
  color: 'white',
  padding: theme.spacing(15, 0),
  borderRadius: '0 0 20% 20%/10%',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 50%)',
    zIndex: 1,
  }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
  }
}));

const StatsSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
  padding: theme.spacing(10, 0),
  borderRadius: '20% 20% 0 0/10%',
  marginTop: theme.spacing(6),
}));

const StatItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
  }
}));

const TeamMember = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  }
}));

const TeamAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  border: '4px solid white',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
    transform: 'scale(1.05)',
  }
}));

const HomePage = () => {
  // Dati statistici di esempio
  const stats = [
    { number: '10,000+', label: 'Utenti Attivi', icon: <RecyclingIcon sx={{ fontSize: 40, color: '#4caf50' }} /> },
    { number: '500,000+', label: 'Rifiuti Classificati', icon: <CheckIcon sx={{ fontSize: 40, color: '#2196f3' }} /> },
    { number: '1,200+', label: 'Tonnellate Risparmiate', icon: <NatureIcon sx={{ fontSize: 40, color: '#ff9800' }} /> },
  ];

  // Caratteristiche dell'app
  const features = [
    {
      title: 'Classificazione Intelligente',
      description: 'Utilizza l\'intelligenza artificiale per identificare e classificare correttamente i rifiuti con una semplice foto.',
      icon: <CameraIcon sx={{ fontSize: 60, color: '#4caf50' }} />,
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Statistiche Personalizzate',
      description: 'Monitora il tuo impatto ambientale con statistiche dettagliate e grafici interattivi sul tuo contributo al riciclo.',
      icon: <StatsIcon sx={{ fontSize: 60, color: '#2196f3' }} />,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Gamification e Premi',
      description: "Guadagna punti, sblocca traguardi e competi nella classifica globale per rendere il riciclo un'attività divertente.",
      icon: <TrophyIcon sx={{ fontSize: 60, color: '#ff9800' }} />,
      image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ];

  // Team membri
  const team = [
    { name: 'Thomas Severgnini', role: 'Lead Developer', },
    { name: 'Moussa Sy', role: 'UI/UX Designer', },
    { name: 'Francesco Devillanova', role: 'AI Specialist', },
    { name: 'Enrico Libutti', role: 'Environmental Expert', }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} sx={{ position: 'relative', zIndex: 2 }}>
              <Typography 
                variant="h2" 
                component="h1" 
                fontWeight="bold" 
                gutterBottom
                className="fade-in"
              >
                Riconosci e Ricicla con WasteWatch
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ mb: 4, opacity: 0.9 }}
                className="fade-in-up"
              >
                L'intelligenza artificiale al servizio dell'ambiente per un futuro più sostenibile
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  component={RouterLink} 
                  to="/register"
                  className="btn-hover-effect"
                  sx={{ 
                    py: 1.5, 
                    px: 4, 
                    borderRadius: 30,
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  Inizia Ora
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  component={RouterLink} 
                  to="/login"
                  className="btn-hover-effect"
                  sx={{ 
                    py: 1.5, 
                    px: 4, 
                    borderRadius: 30,
                    fontSize: '1.1rem',
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  Accedi
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ position: 'relative', zIndex: 2 }}>
              <Box 
                component="img"
                src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Riciclo Intelligente"
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                  transform: 'perspective(1000px) rotateY(-5deg)',
                  transition: 'all 0.5s ease',
                  '&:hover': {
                    transform: 'perspective(1000px) rotateY(0deg)',
                  }
                }}
                className="fade-in"
              />
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Come Funziona */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          fontWeight="bold" 
          textAlign="center" 
          gutterBottom
          sx={{ mb: 6 }}
        >
          Come Funziona
        </Typography>
        
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box 
                sx={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  mb: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                  }
                }}
              >
                <CameraIcon sx={{ fontSize: 40, color: '#4caf50' }} />
              </Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                1. Scatta una Foto
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Utilizza la fotocamera del tuo dispositivo per scattare una foto del rifiuto che desideri classificare.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box 
                sx={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  mb: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                  }
                }}
              >
                <RecyclingIcon sx={{ fontSize: 40, color: '#2196f3' }} />
              </Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                2. Ottieni la Classificazione
              </Typography>
              <Typography variant="body1" color="text.secondary">
                La nostra IA analizzerà l'immagine e ti dirà esattamente come smaltire correttamente il rifiuto.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box 
                sx={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 152, 0, 0.1)',
                  mb: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    backgroundColor: 'rgba(255, 152, 0, 0.2)',
                  }
                }}
              >
                <TrophyIcon sx={{ fontSize: 40, color: '#ff9800' }} />
              </Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                3. Guadagna Punti
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Accumula punti per ogni rifiuto classificato correttamente e sblocca traguardi esclusivi.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Caratteristiche */}
      <Box sx={{ bgcolor: 'rgba(76, 175, 80, 0.05)', py: 10 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            fontWeight="bold" 
            textAlign="center" 
            gutterBottom
            sx={{ mb: 6 }}
          >
            Caratteristiche Principali
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FeatureCard className="card-hover-effect">
                  <CardMedia
                    component="img"
                    height="200"
                    image={feature.image}
                    alt={feature.title}
                  />
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                    <Box sx={{ mt: -6, mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          margin: '0 auto',
                          bgcolor: 'white',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                    </Box>
                    <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Statistiche */}
      <StatsSection>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            fontWeight="bold" 
            textAlign="center" 
            gutterBottom
            sx={{ mb: 6 }}
          >
            Il Nostro Impatto
          </Typography>
          
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={12} md={4} key={index}>
                <StatItem>
                  {stat.icon}
                  <Typography 
                    variant="h3" 
                    fontWeight="bold" 
                    sx={{ my: 2, color: 'text.primary' }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {stat.label}
                  </Typography>
                </StatItem>
              </Grid>
            ))}
          </Grid>
        </Container>
      </StatsSection>

      {/* Team */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          fontWeight="bold" 
          textAlign="center" 
          gutterBottom
          sx={{ mb: 6 }}
        >
          Il Nostro Team
        </Typography>
        
        <Grid container spacing={4}>
          {team.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <TeamMember>
                <TeamAvatar src={member.avatar} alt={member.name} />
                <Typography variant="h6" fontWeight="bold">
                  {member.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.role}
                </Typography>
              </TeamMember>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          py: 10,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 50%)',
            zIndex: 1,
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Unisciti a Noi Oggi
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Inizia a contribuire a un futuro più sostenibile con WasteWatch
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              component={RouterLink} 
              to="/register"
              className="btn-hover-effect"
              sx={{ 
                py: 1.5, 
                px: 5, 
                borderRadius: 30,
                fontSize: '1.1rem',
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'white',
                }
              }}
              endIcon={<ArrowIcon />}
            >
              Inizia Ora
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
