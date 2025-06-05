import React from 'react';
import { Container, Typography, Paper, Box, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', color: 'primary.main', fontWeight: 'bold' }}>
          Informativa sulla Privacy
        </Typography>

        <Box sx={{ my: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
            1. Introduzione
          </Typography>
          <Typography variant="body1" paragraph>
            Benvenuto in WasteWatch. La tua privacy è molto importante per noi. Questa Informativa sulla Privacy spiega come raccogliamo, utilizziamo, divulghiamo e proteggiamo le tue informazioni quando utilizzi la nostra applicazione mobile e il nostro sito web (collettivamente, i "Servizi"). Ti preghiamo di leggere attentamente questa informativa. Se non sei d'accordo con i termini di questa informativa sulla privacy, ti preghiamo di non accedere ai Servizi.
          </Typography>
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
            2. Raccolta delle Informazioni
          </Typography>
          <Typography variant="body1" paragraph>
            Raccogliamo informazioni su di te in vari modi quando utilizzi i nostri Servizi. Queste informazioni possono includere:
          </Typography>
          <ul>
            <li>
              <Typography variant="body1"><strong>Informazioni Personali Identificabili:</strong> Nome, indirizzo email, numero di telefono, e altre informazioni che ci fornisci volontariamente quando ti registri o partecipi a varie attività sui Servizi.</Typography>
            </li>
            <li>
              <Typography variant="body1"><strong>Dati di Utilizzo:</strong> Informazioni su come accedi e utilizzi i Servizi, come il tuo indirizzo IP, tipo di browser, pagine visitate, tempo trascorso sulle pagine, e altre statistiche.</Typography>
            </li>
            <li>
              <Typography variant="body1"><strong>Immagini Caricate:</strong> Immagini di rifiuti che carichi per la classificazione. Queste immagini vengono utilizzate per migliorare i nostri algoritmi di classificazione.</Typography>
            </li>
          </ul>
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
            3. Utilizzo delle Informazioni
          </Typography>
          <Typography variant="body1" paragraph>
            Utilizziamo le informazioni raccolte per vari scopi, tra cui:
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">Fornire, mantenere e migliorare i nostri Servizi.</Typography>
            </li>
            <li>
              <Typography variant="body1">Personalizzare la tua esperienza utente.</Typography>
            </li>
            <li>
              <Typography variant="body1">Comunicare con te, inclusa la risposta alle tue richieste e l'invio di aggiornamenti.</Typography>
            </li>
            <li>
              <Typography variant="body1">Monitorare e analizzare l'utilizzo e le tendenze per migliorare i Servizi.</Typography>
            </li>
            <li>
              <Typography variant="body1">Proteggere la sicurezza e l'integrità dei nostri Servizi.</Typography>
            </li>
          </ul>
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
            4. Condivisione delle Informazioni
          </Typography>
          <Typography variant="body1" paragraph>
            Non condividiamo le tue informazioni personali con terze parti, tranne nei seguenti casi:
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">Con il tuo consenso.</Typography>
            </li>
            <li>
              <Typography variant="body1">Per adempiere a obblighi legali.</Typography>
            </li>
            <li>
              <Typography variant="body1">Per proteggere i nostri diritti e la nostra proprietà.</Typography>
            </li>
            <li>
              <Typography variant="body1">Con fornitori di servizi terzi che eseguono servizi per nostro conto (ad es. hosting, analisi dei dati), a condizione che tali fornitori accettino di mantenere riservate tali informazioni.</Typography>
            </li>
          </ul>
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
            5. Sicurezza delle Informazioni
          </Typography>
          <Typography variant="body1" paragraph>
            Adottiamo misure di sicurezza ragionevoli per proteggere le tue informazioni da accessi non autorizzati, uso improprio o divulgazione. Tuttavia, nessun sistema di sicurezza è impenetrabile e non possiamo garantire la sicurezza assoluta delle tue informazioni.
          </Typography>
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
            6. I Tuoi Diritti
          </Typography>
          <Typography variant="body1" paragraph>
            Hai il diritto di accedere, correggere o eliminare le tue informazioni personali in nostro possesso. Puoi anche opporti al trattamento dei tuoi dati personali in determinate circostanze. Per esercitare questi diritti, ti preghiamo di contattarci all'indirizzo fornito di seguito.
          </Typography>
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
            7. Modifiche a questa Informativa sulla Privacy
          </Typography>
          <Typography variant="body1" paragraph>
            Potremmo aggiornare questa Informativa sulla Privacy di tanto in tanto. Ti informeremo di eventuali modifiche pubblicando la nuova Informativa sulla Privacy sui Servizi. Ti consigliamo di rivedere periodicamente questa Informativa sulla Privacy per eventuali modifiche.
          </Typography>
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
            8. Contattaci
          </Typography>
          <Typography variant="body1" paragraph>
            Se hai domande o dubbi riguardo a questa Informativa sulla Privacy, ti preghiamo di contattarci a: [email protected]
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <MuiLink component={RouterLink} to="/" variant="body1" sx={{ textDecoration: 'none' }}>
            Torna alla Home Page
          </MuiLink>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicyPage;
