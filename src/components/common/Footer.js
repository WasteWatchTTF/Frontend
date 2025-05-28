import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton, Divider, Button, TextField, Paper, useTheme } from '@mui/material';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  LinkedIn, 
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
  RecyclingTwoTone as RecyclingIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

// Styled components
const SocialIconButton = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(0.5),
  color: 'white',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  display: 'block',
  marginBottom: theme.spacing(1),
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  position: 'relative',
  paddingLeft: theme.spacing(2),
  '&:before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    width: 6,
    height: 6,
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50%',
    transform: 'translateY(-50%) scale(0)',
    transition: 'transform 0.3s ease',
  },
  '&:hover': {
    color: 'white',
    paddingLeft: theme.spacing(3),
    '&:before': {
      transform: 'translateY(-50%) scale(1)',
    },
  },
}));

const NewsletterInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 30,
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    color: 'white',
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
}));

const FooterSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(76, 175, 80, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
    pointerEvents: 'none',
  },
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  color: 'rgba(255, 255, 255, 0.7)',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: 'white',
    transform: 'translateX(5px)',
  },
}));

function Footer() {
  const theme = useTheme();
  
  return (
    <FooterSection
      component="footer"
      sx={{
        pt: 6,
        pb: 4,
        mt: 'auto',
        backgroundColor: '#1e3a2f',
        backgroundImage: 'linear-gradient(to right, #1e3a2f, #2e5a40)',
        color: 'white',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RecyclingIcon 
                sx={{ 
                  fontSize: 36, 
                  mr: 1,
                  color: '#4caf50',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }} 
              />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #ffffff 30%, #e0f2f1 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                WasteWatch
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              color="rgba(255, 255, 255, 0.7)"
              sx={{ mb: 3, maxWidth: 300 }}
            >
              Riconosci e smaltisci correttamente i rifiuti con l'aiuto dell'intelligenza artificiale. 
              Contribuisci a un mondo più pulito e sostenibile.
            </Typography>
            
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Contattaci
            </Typography>
            
            <ContactItem>
              <LocationIcon sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">
                Via dell'Ambiente 123, Milano, Italia
              </Typography>
            </ContactItem>
            
            <ContactItem>
              <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">
                info@wastewatch.it
              </Typography>
            </ContactItem>
            
            <ContactItem>
              <PhoneIcon sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">
                +39 02 1234567
              </Typography>
            </ContactItem>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 40,
                  height: 3,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 2,
                }
              }}
            >
              Link Utili
            </Typography>
            
            <FooterLink component={RouterLink} to="/">
              Home
            </FooterLink>
            <FooterLink component={RouterLink} to="/about">
              Chi Siamo
            </FooterLink>
            <FooterLink component={RouterLink} to="/classification">
              Classifica Rifiuti
            </FooterLink>
            <FooterLink component={RouterLink} to="/statistics">
              Statistiche
            </FooterLink>
            <FooterLink component={RouterLink} to="/leaderboard">
              Classifica
            </FooterLink>
            <FooterLink component={RouterLink} to="/achievements">
              Traguardi
            </FooterLink>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 40,
                  height: 3,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 2,
                }
              }}
            >
              Legali
            </Typography>
            
            <FooterLink href="#">
              Privacy Policy
            </FooterLink>
            <FooterLink href="#">
              Termini di Servizio
            </FooterLink>
            <FooterLink href="#">
              Cookie Policy
            </FooterLink>
            <FooterLink href="#">
              FAQ
            </FooterLink>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 40,
                  height: 3,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 2,
                }
              }}
            >
              Newsletter
            </Typography>
            
            <Typography 
              variant="body2" 
              color="rgba(255, 255, 255, 0.7)"
              sx={{ mb: 2 }}
            >
              Iscriviti alla nostra newsletter per ricevere aggiornamenti e consigli sul riciclo.
            </Typography>
            
            <Box sx={{ display: 'flex', mb: 3 }}>
              <NewsletterInput
                label="La tua email"
                variant="outlined"
                size="small"
                fullWidth
                sx={{ mr: 1 }}
              />
              <Button 
                variant="contained" 
                color="primary"
                sx={{ 
                  borderRadius: 30,
                  minWidth: 'auto',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                  }
                }}
              >
                <SendIcon />
              </Button>
            </Box>
            
            <Typography 
              variant="subtitle2" 
              fontWeight={600}
              sx={{ mb: 2 }}
            >
              Seguici
            </Typography>
            
            <Box sx={{ display: 'flex' }}>
              <SocialIconButton aria-label="facebook">
                <Facebook />
              </SocialIconButton>
              <SocialIconButton aria-label="twitter">
                <Twitter />
              </SocialIconButton>
              <SocialIconButton aria-label="instagram">
                <Instagram />
              </SocialIconButton>
              <SocialIconButton aria-label="linkedin">
                <LinkedIn />
              </SocialIconButton>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', sm: 'center' },
        }}>
          <Typography 
            variant="body2" 
            color="rgba(255, 255, 255, 0.6)"
            sx={{ mb: { xs: 2, sm: 0 } }}
          >
            © {new Date().getFullYear()} WasteWatch. Tutti i diritti riservati.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography 
              variant="body2" 
              component={Link}
              href="#"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                '&:hover': { color: 'white' }
              }}
            >
              Privacy
            </Typography>
            <Typography 
              variant="body2" 
              component={Link}
              href="#"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                '&:hover': { color: 'white' }
              }}
            >
              Termini
            </Typography>
            <Typography 
              variant="body2" 
              component={Link}
              href="#"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                '&:hover': { color: 'white' }
              }}
            >
              Cookie
            </Typography>
          </Box>
        </Box>
      </Container>
    </FooterSection>
  );
}

export default Footer;
