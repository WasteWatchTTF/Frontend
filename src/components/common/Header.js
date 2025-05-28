import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useScrollTrigger,
  Slide,
  Fade,
  Badge,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  PhotoCamera as CameraIcon,
  Leaderboard as LeaderboardIcon,
  BarChart as StatsIcon,
  EmojiEvents as AchievementsIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useAuth } from '../../services/AuthContext';
import { useTheme } from '../../services/ThemeContext';
import RecyclingIcon from '@mui/icons-material/Recycling';
import { styled } from '@mui/material/styles';

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  background: 'linear-gradient(90deg, #4caf50 0%, #2e7d32 100%)',
  transition: 'all 0.3s ease',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: 'linear-gradient(45deg, #ffffff 30%, #e0f2f1 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '0.5px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: active ? '80%' : '0%',
    height: '3px',
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease',
    transform: 'translateX(-50%)',
    borderRadius: '3px 3px 0 0',
  },
  '&:hover::after': {
    width: '80%',
  },
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: '2px solid rgba(255, 255, 255, 0.8)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
  },
}));

const NotificationBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#ff9800',
    color: 'white',
    boxShadow: '0 0 10px rgba(255, 152, 0, 0.5)',
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

// Pagine disponibili solo per utenti autenticati
const authenticatedPages = [
  { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { name: 'Classifica Rifiuti', path: '/classification', icon: <CameraIcon /> },
  { name: 'Classifica', path: '/leaderboard', icon: <LeaderboardIcon /> },
  { name: 'Statistiche', path: '/statistics', icon: <StatsIcon /> },
  { name: 'Traguardi', path: '/achievements', icon: <AchievementsIcon /> },
];

// Pagine disponibili per utenti non autenticati
const authPages = [
  { name: 'Accedi', path: '/login', icon: <LoginIcon /> },
  { name: 'Registrati', path: '/register', icon: <RegisterIcon /> },
];

// Pagine pubbliche (sempre visibili)
const publicPages = [
  { name: 'Home', path: '/', icon: <HomeIcon /> },
];

function Header() {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState([]); 
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Hide header on scroll down, show on scroll up
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  // Effect to handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Mock notifications - in a real app these would come from an API
  useEffect(() => {
    if (isAuthenticated) {
      setNotifications([
        { id: 1, message: 'Hai sbloccato un nuovo traguardo!', read: false },
        { id: 2, message: 'La tua classificazione è stata completata', read: false },
      ]);
    }
  }, [isAuthenticated]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifications = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
  };

  // La funzione toggleDarkMode è stata sostituita da toggleTheme dal contesto

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };
  
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <StyledAppBar position="sticky" elevation={scrolled ? 4 : 0} sx={{ mb: 2 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo for larger screens */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <RecyclingIcon 
                sx={{ 
                  mr: 1, 
                  fontSize: 32,
                  color: '#ffffff',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'rotate(20deg)' }
                }} 
              />
              <LogoText
                variant="h5"
                noWrap
                component={RouterLink}
                to="/"
                sx={{ mr: 2 }}
                className="fade-in"
              >
                WasteWatch
              </LogoText>
            </Box>

            {/* Mobile menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={toggleDrawer(true)}
                color="inherit"
                className="btn-hover-effect"
                sx={{ 
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'scale(1.1)' }
                }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                PaperProps={{
                  sx: {
                    borderRadius: '0 16px 16px 0',
                    boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <Box
                  sx={{ width: 280 }}
                  role="presentation"
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                >
                  <Box 
                    sx={{ 
                      p: 3, 
                      display: 'flex', 
                      alignItems: 'center',
                      background: 'linear-gradient(90deg, #4caf50 0%, #2e7d32 100%)',
                      color: 'white',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      mb: 1
                    }}
                  >
                    <RecyclingIcon sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="h6" component="div" fontWeight="bold">
                      WasteWatch
                    </Typography>
                  </Box>
                  <Divider />
                  <List sx={{ pt: 2 }}>
                    {/* Mostra sempre le pagine pubbliche */}
                    {publicPages.map((page) => {
                      const isActive = location.pathname === page.path;
                      return (
                        <ListItem 
                          button 
                          key={page.name}
                          component={RouterLink}
                          to={page.path}
                          selected={isActive}
                          sx={{
                            mb: 1,
                            borderRadius: '0 24px 24px 0',
                            pl: 2,
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&::before': isActive ? {
                              content: '""',
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              height: '100%',
                              width: '4px',
                              backgroundColor: 'primary.main',
                              borderRadius: '0 4px 4px 0',
                            } : {},
                            '&:hover': {
                              backgroundColor: 'rgba(76, 175, 80, 0.08)',
                              transform: 'translateX(4px)'
                            },
                            ...(isActive && {
                              backgroundColor: 'rgba(76, 175, 80, 0.12)',
                              '& .MuiListItemIcon-root': {
                                color: 'primary.main',
                              },
                              '& .MuiListItemText-primary': {
                                fontWeight: 600,
                                color: 'primary.main',
                              },
                            }),
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>{page.icon}</ListItemIcon>
                          <ListItemText 
                            primary={page.name} 
                            primaryTypographyProps={{
                              fontSize: 15,
                              fontWeight: isActive ? 600 : 500,
                            }}
                          />
                          {isActive && (
                            <Box 
                              sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%', 
                                bgcolor: 'primary.main',
                                mr: 1
                              }} 
                            />
                          )}
                        </ListItem>
                      );
                    })}
                    
                    {/* Mostra le pagine autenticate solo se l'utente ha fatto login */}
                    {isAuthenticated && authenticatedPages.map((page) => {
                      const isActive = location.pathname === page.path;
                      return (
                        <ListItem 
                          button 
                          key={page.name}
                          component={RouterLink}
                          to={page.path}
                          selected={isActive}
                          sx={{
                            mb: 1,
                            borderRadius: '0 24px 24px 0',
                            pl: 2,
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&::before': isActive ? {
                              content: '""',
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              height: '100%',
                              width: '4px',
                              backgroundColor: 'primary.main',
                              borderRadius: '0 4px 4px 0',
                            } : {},
                            '&:hover': {
                              backgroundColor: 'rgba(76, 175, 80, 0.08)',
                              transform: 'translateX(4px)'
                            },
                            ...(isActive && {
                              backgroundColor: 'rgba(76, 175, 80, 0.12)',
                              '& .MuiListItemIcon-root': {
                                color: 'primary.main',
                              },
                              '& .MuiListItemText-primary': {
                                fontWeight: 600,
                                color: 'primary.main',
                              },
                            }),
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>{page.icon}</ListItemIcon>
                          <ListItemText 
                            primary={page.name} 
                            primaryTypographyProps={{
                              fontSize: 15,
                              fontWeight: isActive ? 600 : 500,
                            }}
                          />
                          {isActive && (
                            <Box 
                              sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%', 
                                bgcolor: 'primary.main',
                                mr: 1
                              }} 
                            />
                          )}
                        </ListItem>
                      );
                    })}
                  </List>
                  {!isAuthenticated && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography 
                        variant="subtitle2" 
                        color="text.secondary" 
                        sx={{ px: 3, mb: 1 }}
                      >
                        Account
                      </Typography>
                      <List>
                        {authPages.map((page) => (
                          <ListItem 
                            button 
                            key={page.name}
                            component={RouterLink}
                            to={page.path}
                            selected={location.pathname === page.path}
                            sx={{
                              borderRadius: '0 24px 24px 0',
                              pl: 2,
                              mb: 1,
                              '&:hover': {
                                backgroundColor: 'rgba(33, 150, 243, 0.08)',
                                transform: 'translateX(4px)'
                              },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 40, color: 'secondary.main' }}>{page.icon}</ListItemIcon>
                            <ListItemText 
                              primary={page.name} 
                              primaryTypographyProps={{
                                fontSize: 15,
                                fontWeight: 500,
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ px: 2, pb: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Chip 
                      icon={darkMode ? <LightModeIcon /> : <DarkModeIcon />} 
                      label={darkMode ? "Tema Chiaro" : "Tema Scuro"}
                      onClick={toggleTheme}
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{ borderRadius: 8 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      v1.0.0
                    </Typography>
                  </Box>
                </Box>
              </Drawer>
            </Box>

            {/* Logo for mobile */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', flexGrow: 1 }}>
              <RecyclingIcon sx={{ mr: 1, color: '#ffffff' }} />
              <LogoText
                variant="h6"
                noWrap
                component={RouterLink}
                to="/"
              >
                WasteWatch
              </LogoText>
            </Box>

            {/* Desktop menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
              {/* Mostra sempre le pagine pubbliche */}
              {publicPages.map((page) => {
                const isActive = location.pathname === page.path;
                return (
                  <NavButton
                    key={page.name}
                    component={RouterLink}
                    to={page.path}
                    active={isActive ? 1 : 0}
                    className="btn-hover-effect"
                    sx={{ 
                      mx: 0.5,
                      my: 2, 
                      color: 'white', 
                      display: 'flex',
                      alignItems: 'center',
                      px: 2,
                      py: 1,
                      borderRadius: '12px',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateY(-2px)',
                      }
                    }}
                    startIcon={page.icon}
                  >
                    {page.name}
                  </NavButton>
                );
              })}
              
              {/* Mostra le pagine autenticate solo se l'utente ha fatto login */}
              {isAuthenticated && authenticatedPages.map((page) => {
                const isActive = location.pathname === page.path;
                return (
                  <NavButton
                    key={page.name}
                    component={RouterLink}
                    to={page.path}
                    active={isActive ? 1 : 0}
                    className="btn-hover-effect"
                    sx={{ 
                      mx: 0.5,
                      my: 2, 
                      color: 'white', 
                      display: 'flex',
                      alignItems: 'center',
                      px: 2,
                      py: 1,
                      borderRadius: '12px',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateY(-2px)',
                      }
                    }}
                    startIcon={page.icon}
                  >
                    {page.name}
                  </NavButton>
                );
              })}
            </Box>

            {/* User menu or auth buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Theme toggle button */}
              <Tooltip title={darkMode ? "Passa al tema chiaro" : "Passa al tema scuro"}>
                <IconButton 
                  onClick={toggleTheme} 
                  color="inherit"
                  sx={{ 
                    mr: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'rotate(30deg)' }
                  }}
                >
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <Tooltip title="Notifiche">
                    <IconButton 
                      onClick={handleOpenNotifications} 
                      color="inherit"
                      sx={{ mr: 2 }}
                    >
                      <NotificationBadge badgeContent={unreadNotificationsCount} color="error">
                        <NotificationsIcon />
                      </NotificationBadge>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="notifications-menu"
                    anchorEl={anchorElNotifications}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElNotifications)}
                    onClose={handleCloseNotifications}
                    PaperProps={{
                      elevation: 3,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                        mt: 1.5,
                        width: 320,
                        borderRadius: 2,
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                  >
                    <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="h6" fontWeight={600}>Notifiche</Typography>
                    </Box>
                    {notifications.length > 0 ? (
                      <List sx={{ p: 0 }}>
                        {notifications.map((notification) => (
                          <ListItem 
                            key={notification.id} 
                            sx={{ 
                              borderLeft: notification.read ? 'none' : '4px solid',
                              borderColor: 'primary.main',
                              bgcolor: notification.read ? 'transparent' : 'rgba(76, 175, 80, 0.08)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                bgcolor: 'rgba(76, 175, 80, 0.05)',
                              }
                            }}
                          >
                            <ListItemText 
                              primary={notification.message} 
                              secondary={"Adesso"}
                              primaryTypographyProps={{
                                fontWeight: notification.read ? 400 : 600,
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Nessuna notifica
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                      <Button size="small" color="primary">
                        Vedi tutte
                      </Button>
                    </Box>
                  </Menu>

                  {/* User menu */}
                  <Tooltip title="Impostazioni account">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <UserAvatar 
                        onClick={handleOpenUserMenu} 
                        sx={{ 
                          bgcolor: 'secondary.main',
                          color: 'white',
                          width: 40,
                          height: 40,
                        }}
                      >
                        {getInitials(currentUser?.username)}
                      </UserAvatar>
                      <IconButton 
                        onClick={handleOpenUserMenu}
                        size="small" 
                        sx={{ ml: 0.5, color: 'white' }}
                      >
                        <ExpandMoreIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    PaperProps={{
                      elevation: 3,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                        mt: 1.5,
                        borderRadius: 2,
                        minWidth: 180,
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {currentUser?.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {currentUser?.email}
                      </Typography>
                    </Box>
                    <MenuItem onClick={() => {
                      handleCloseUserMenu();
                      navigate('/profile');
                    }} sx={{ py: 1.5 }}>
                      <ListItemIcon>
                        <Avatar sx={{ width: 24, height: 24 }} />
                      </ListItemIcon>
                      <ListItemText primary="Profilo" />
                    </MenuItem>
                    <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Logout" />
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  {authPages.map((page) => (
                    <Button
                      key={page.name}
                      component={RouterLink}
                      to={page.path}
                      variant={page.name === 'Accedi' ? 'outlined' : 'contained'}
                      className="btn-hover-effect"
                      sx={{ 
                        mx: 1,
                        color: page.name === 'Accedi' ? 'white' : 'inherit',
                        borderColor: page.name === 'Accedi' ? 'white' : 'transparent',
                        borderWidth: page.name === 'Accedi' ? 2 : 0,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: page.name === 'Accedi' ? 'white' : 'transparent',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        }
                      }}
                      startIcon={page.icon}
                    >
                      {page.name}
                    </Button>
                  ))}
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>
    </Slide>
  );
}

export default Header;
