import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  Alert, 
  CircularProgress,
  Grid,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../services/AuthContext';
import { 
  Visibility, 
  VisibilityOff, 
  Person, 
  Email, 
  Lock 
} from '@mui/icons-material';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 450, mx: 'auto' }}>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            animation: 'shake 0.5s ease-in-out',
            '@keyframes shake': {
              '0%, 100%': { transform: 'translateX(0)' },
              '25%': { transform: 'translateX(-5px)' },
              '75%': { transform: 'translateX(5px)' },
            },
          }}
        >
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            animation: 'bounceIn 0.6s ease-out',
            '@keyframes bounceIn': {
              '0%': { opacity: 0, transform: 'scale(0.3)' },
              '50%': { opacity: 1, transform: 'scale(1.05)' },
              '100%': { opacity: 1, transform: 'scale(1)' },
            },
          }}
        >
          {success}
        </Alert>
      )}
      
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(76, 175, 80, 0.02)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(76, 175, 80, 0.04)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(76, 175, 80, 0.05)',
                    boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(76, 175, 80, 0.02)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(76, 175, 80, 0.04)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(76, 175, 80, 0.05)',
                    boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(76, 175, 80, 0.02)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(76, 175, 80, 0.04)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(76, 175, 80, 0.05)',
                    boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="confirmPassword"
              label="Conferma Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(76, 175, 80, 0.02)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(76, 175, 80, 0.04)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(76, 175, 80, 0.05)',
                    boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            py: 1.8,
            mt: 4,
            mb: 3,
            borderRadius: 2,
            fontSize: '1.1rem',
            fontWeight: 600,
            textTransform: 'none',
            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
            boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, #45a049 0%, #5cb860 100%)',
              boxShadow: '0 12px 35px rgba(76, 175, 80, 0.4)',
              transform: 'translateY(-2px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
            '&:disabled': {
              background: 'rgba(76, 175, 80, 0.3)',
              boxShadow: 'none',
            },
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} sx={{ color: 'white' }} />
              <Typography variant="button" sx={{ color: 'white' }}>
                Creazione account...
              </Typography>
            </Box>
          ) : (
            'Crea il tuo Account'
          )}
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Hai già un account?
          </Typography>
          <Link 
            component={RouterLink} 
            to="/login" 
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              '&:hover': {
                textDecoration: 'underline',
                color: 'primary.dark',
              },
            }}
          >
            Accedi ora
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

export default Register;
