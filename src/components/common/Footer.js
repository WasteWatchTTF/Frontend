import React from 'react';
import { Box, Container, Typography, Link as MuiLink, Grid, IconButton, Divider, Button, TextField, useTheme } from '@mui/material';
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
import { Link as RouterLink } from 'react-router-dom'; // Assicurarsi che RouterLink sia importato

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

const FooterLink = styled(MuiLink)(({ theme }) => ({
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
        pt: 3, // Ulteriore riduzione padding top
        pb: 2, // Ulteriore riduzione padding bottom
        mt: 'auto',
        backgroundColor: '#1e3a2f',
        backgroundImage: 'linear-gradient(to right, #1e3a2f, #2e5a40)',
        color: 'white',
        boxShadow: '0 -1px 5px rgba(0, 0, 0, 0.08)', // Ombra ancora più leggera
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Colonna Logo e Descrizione */} 
          <Grid item xs={12} md={7} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', mb: 2 }}>
              <RecyclingIcon 
                sx={{ 
                  fontSize: 32, // Ridotto ulteriormente
                  mr: 1,
                  color: 'primary.main',
                  filter: 'drop-shadow(0 1px 3px rgba(76,175,80,0.25))'
                }} 
              />
              <Typography 
                variant="h6" // Ridotto da h5
                component="div"
                sx={{ 
                  fontWeight: 'bold',
                  letterSpacing: '0.1px',
                  color: 'white',
                }}
              >
                WasteWatch
              </Typography>
            </Box>
            <Typography 
              variant="body2" // Ridotto da body1
              color="rgba(255, 255, 255, 0.75)"
              sx={{ mb: 1.5, lineHeight: 1.5, fontSize: '0.85rem' }} // Font, interlinea e margine ridotti
            >
              La tua guida smart per un riciclo consapevole. 
              Identifica i materiali con una foto e contribuisci a un futuro più verde.
            </Typography>
          </Grid>
          
          {/* Colonna Link Utili/Legali */} 
          <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography 
              variant="subtitle2" // Ridotto da subtitle1
              fontWeight={600}
              sx={{
                mb: 2,
                position: 'relative',
                color: 'white',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -5, // Sottolineatura ancora più vicina
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%', // Sottolineatura più corta
                  height: 2, // Sottolineatura ancora più sottile
                  backgroundColor: 'primary.light',
                  borderRadius: '2px',
                  ...(theme.breakpoints.up('md') && {
                    left: 0,
                    transform: 'none',
                    width: 35, // Sottolineatura ancora più corta per md
                  }),
                }
              }}
            >
              Link Utili
            </Typography>
            <FooterLink component={RouterLink} to="/">Home</FooterLink>
            <FooterLink component={RouterLink} to="/classification">Classifica Rifiuti</FooterLink>
            <FooterLink component={RouterLink} to="/statistics">Statistiche</FooterLink>
            <FooterLink component={RouterLink} to="/leaderboard">Classifica Utenti</FooterLink>
            <FooterLink component={RouterLink} to="/achievements">Traguardi</FooterLink>
            {/* Privacy Policy spostata in basso */}
            {/* <FooterLink component={MuiLink} href="#" onClick={(e) => e.preventDefault()}>Termini</FooterLink> */}
            {/* <FooterLink component={MuiLink} href="#" onClick={(e) => e.preventDefault()}>Cookie</FooterLink> */}
          </Grid>
        </Grid>
        
        {/* Divider rimosso per un look più compatto, il Box sottostante avrà un bordo superiore */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'center',
          pt: 2, // Ridotto padding sopra il copyright
          borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
          mt: 3 // Ridotto margine sopra la sezione copyright
        }}>
          <Typography 
            variant="caption" 
            color="rgba(255, 255, 255, 0.6)"
            sx={{ fontSize: '0.75rem', mb: { xs: 1, sm: 0 } }}
          >
            © {new Date().getFullYear()} WasteWatch. Tutti i diritti riservati.
          </Typography>
          <Typography 
            variant="caption" 
            component={RouterLink} 
            to="/privacy-policy"
            sx={{ 
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.6)', 
              textDecoration: 'none',
              '&:hover': { 
                color: 'white', 
                textDecoration: 'underline' 
              }
            }}
          >
            Privacy Policy
          </Typography>
        </Box>
      </Container>
    </FooterSection>
  );
}

export default Footer;
