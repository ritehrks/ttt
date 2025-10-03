import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider,
  ListItem, ListItemIcon, ListItemText, CssBaseline, Badge,
  IconButton, Switch, FormControlLabel, ListItemButton, Menu, MenuItem
} from '@mui/material';
import {
  Dashboard, Map as MapIcon, Calculate, Analytics, ReportProblem,
  Notifications, Settings, Menu as MenuIcon, SmartToy as AI, Timeline,
  HealthAndSafety, DataUsage, Emergency, Language
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { AIService } from '../../services/aiService';
import { useTranslation } from 'react-i18next';

const drawerWidth = 280;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);

  // Language menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { i18n } = useTranslation<any>();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Get the single instance of our AI Service
  const aiService = AIService.getInstance();

  // Hook into the Redux store to get the number of active alerts
  const alertCount = useSelector((state: RootState) => state.alertSystem.activeAlerts.length);

  // This `useEffect` hook runs when the `aiEnabled` state changes
  useEffect(() => {
    if (aiEnabled) {
      aiService.loadModels();
    }
  }, [aiEnabled, aiService]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Navigation items
  const navigationItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', aiFeature: false },
    { text: 'Interactive Map', icon: <MapIcon />, path: '/map', aiFeature: false },
    { text: 'HMPI Calculator', icon: <Calculate />, path: '/calculator', aiFeature: false },
    { text: 'Analytics', icon: <Analytics />, path: '/analytics', aiFeature: false },
  ];

  const aiNavigationItems = [
    { text: 'Risk Assessment', icon: <AI />, path: '/ai-center', aiFeature: true },
    { text: 'Anomaly Detector', icon: <DataUsage />, path: '/source-detection', aiFeature: true },
    { text: 'Health Risk Predictor', icon: <HealthAndSafety />, path: '/health-predictions', aiFeature: true },
    { text: 'Agriculture Health Predictor', icon: <Timeline />, path: '/time-travel', aiFeature: true },
    { text: 'Alerts System', icon: <Emergency />, path: '/alerts', aiFeature: true },
    { text: 'Citizen Reports', icon: <ReportProblem />, path: '/citizen-reports', aiFeature: true },
  ];

  const settingsNavigationItems = [
    { text: 'Settings', icon: <Settings />, path: '/settings', aiFeature: false },
  ];

  // Sidebar drawer
  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          HMPI Monitor AI
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ p: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={aiEnabled}
              onChange={(e) => setAiEnabled(e.target.checked)}
              color="primary"
            />
          }
          label="Enable AI Features"
        />
      </Box>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={NavLink} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {aiNavigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              disabled={!aiEnabled}
              sx={{
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                opacity: !aiEnabled ? 0.5 : 1,
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: 600, color: 'primary.main' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {settingsNavigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={NavLink} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Heavy Metal Pollution Index Monitoring System
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={alertCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton sx={{ ml: 1, color: '#fff' }} onClick={handleMenuOpen}>
            <Language />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { i18n.changeLanguage('en'); handleMenuClose(); }}>English</MenuItem>
            <MenuItem onClick={() => { i18n.changeLanguage('hi'); handleMenuClose(); }}>हिन्दी</MenuItem>
            <MenuItem onClick={() => { i18n.changeLanguage('gu'); handleMenuClose(); }}>ગુજરાતી</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Drawer for mobile view */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* Drawer for desktop view */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
