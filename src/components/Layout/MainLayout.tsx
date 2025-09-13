import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider,
  ListItem, ListItemIcon, ListItemText, CssBaseline, Badge,
  IconButton, Switch, FormControlLabel, ListItemButton
} from '@mui/material';
import {
  Dashboard, Map as MapIcon, Calculate, Analytics, ReportProblem,
  Notifications, Settings, Menu as MenuIcon, SmartToy as AI, Timeline,
  HealthAndSafety, DataUsage, Emergency
} from '@mui/icons-material';
import { useSelector} from 'react-redux';
import { RootState } from '../../store/store';
import { AIService } from '../../services/aiService';

const drawerWidth = 280;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);

  // Get the single instance of our AI Service from Step 3
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

  // An array of objects defining our navigation links
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
    { text: 'Trend Analysis', icon: <Timeline />, path: '/time-travel', aiFeature: true },
  ];
  
  const settingsNavigationItems = [
    { text: 'Settings', icon: <Settings />, path: '/settings', aiFeature: false },
  ];


  // This variable holds the JSX for the entire sidebar content
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
                {item.text === 'Emergency Alerts' ? (
                  <Badge badgeContent={alertCount} color="error">{item.icon}</Badge>
                ) : (
                  item.icon
                )}
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
