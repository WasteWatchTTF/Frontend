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
  Email 
} from '@mui/icons-material';

const validationSchema = Yup.object({
  usernameOrEmail: Yup.string()
    .required('Username o email richiesto'),
  password: Yup.string()
    .required('Password richiesta')
});

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      usernameOrEmail: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      
      try {
        const result = await login(values.usernameOrEmail, values.password);
        
        if (result.success) {
          navigate('/dashboard');
        } else {
          setError(result.message || 'Credenziali non valide. Riprova.');
        }
      } catch (err) {
        setError('Si è verificato un errore durante il login. Riprova più tardi.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
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
      
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
        <TextField
          fullWidth
          id="usernameOrEmail"
          label="Username o Email"
          name="usernameOrEmail"
          autoComplete="email"
          autoFocus
          value={formik.values.usernameOrEmail}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.usernameOrEmail && Boolean(formik.errors.usernameOrEmail)}
          helperText={formik.touched.usernameOrEmail && formik.errors.usernameOrEmail}
          disabled={loading}
          sx={{
            mb: 3,
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

        <TextField
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          disabled={loading}
          sx={{
            mb: 4,
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

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            py: 1.8,
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
                Accesso in corso...
              </Typography>
            </Box>
          ) : (
            'Accedi al tuo Account'
          )}
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Non hai un account?
          </Typography>
          <Link 
            component={RouterLink} 
            to="/register" 
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
            Registrati ora
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
