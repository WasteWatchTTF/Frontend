import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Link, 
  Alert, 
  CircularProgress,
  Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../services/AuthContext';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Avatar from '@mui/material/Avatar';

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Il nome utente deve contenere almeno 3 caratteri')
    .max(20, 'Il nome utente non può superare i 20 caratteri')
    .required('Nome utente richiesto'),
  email: Yup.string()
    .email('Inserisci un indirizzo email valido')
    .required('Email richiesta'),
  password: Yup.string()
    .min(6, 'La password deve contenere almeno 6 caratteri')
    .required('Password richiesta'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Le password devono corrispondere')
    .required('Conferma password richiesta')
});

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      setSuccess('');
      
      try {
        const result = await register(values.username, values.email, values.password);
        
        if (result.success) {
          setSuccess('Registrazione completata con successo! Ora puoi accedere.');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setError(result.message || 'Errore durante la registrazione. Riprova.');
        }
      } catch (err) {
        setError('Si è verificato un errore durante la registrazione. Riprova più tardi.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          mt: 8 
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5" gutterBottom>
          Registrati
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            {success}
          </Alert>
        )}
        
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="username"
                label="Nome Utente"
                name="username"
                autoComplete="username"
                autoFocus
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                label="Indirizzo Email"
                name="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="confirmPassword"
                label="Conferma Password"
                type="password"
                id="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                disabled={loading}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Registrati'}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              Hai già un account? Accedi
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;
