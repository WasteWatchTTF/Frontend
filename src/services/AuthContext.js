import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if token is valid on load
  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        try {
          // Prima controlla se abbiamo dati utente salvati nel localStorage
          const savedUserData = localStorage.getItem('userData');
          if (savedUserData) {
            try {
              const userData = JSON.parse(savedUserData);
              // Verifica che il token non sia scaduto
              const decodedToken = jwtDecode(token);
              
              const currentTime = Date.now() / 1000;
              
              if (decodedToken.exp < currentTime) {
                // Token is expired
                logout();
                return;
              }
              
              setCurrentUser(userData);
              setLoading(false);
              return;
            } catch (parseError) {
              console.error('Error parsing saved user data:', parseError);
              // Se c'è un errore nel parsing, continua con la decodifica del token
            }
          }
          
          // Fallback: prova a decodificare dal token (per compatibilità con versioni precedenti)
          const decodedToken = jwtDecode(token);
          console.log('AuthContext - decodedToken (fallback):', decodedToken);
          
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            // Token is expired
            logout();
          } else {
            // Set current user from token (nota: l'ID potrebbe non essere disponibile)
            const user = {
              id: decodedToken.id,
              username: decodedToken.sub,
              email: decodedToken.email,
              roles: decodedToken.roles
            };
            console.log('AuthContext - Setting currentUser from token (fallback):', user);
            setCurrentUser(user);
          }
        } catch (error) {
          console.error('Invalid token:', error);
          logout();
        }
      }
      setLoading(false);
    };
    
    checkToken();
  }, [token]);

  const login = async (usernameOrEmail, password) => {
    try {
      const response = await axios.post('/api/auth/signin', { usernameOrEmail, password });
      const { token, id, username, email, roles } = response.data;
      
      console.log('AuthContext - Login response data:', response.data);
      console.log('AuthContext - User ID from response:', id);
      
      localStorage.setItem('token', token);
      
      // Salva anche i dati utente nel localStorage per persistenza
      const userData = { id, username, email, roles };
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setToken(token);
      setCurrentUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Errore durante il login. Riprova.'
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post('/api/auth/signup', { 
        username, 
        email, 
        password,
        roles: ['USER']
      });
      
      return { success: true, message: response.data };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data || 'Errore durante la registrazione. Riprova.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setToken(null);
    setCurrentUser(null);
    navigate('/login');
  };

  const value = {
    currentUser,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
