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
  CircularProgress 
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../services/AuthContext';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';

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
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" gutterBottom>
          Accedi
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
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
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Accedi'}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link component={RouterLink} to="/register" variant="body2">
              Non hai un account? Registrati
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
