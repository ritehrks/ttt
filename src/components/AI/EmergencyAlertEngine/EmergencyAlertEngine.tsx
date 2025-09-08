import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Button, Chip,
  Alert, Switch, FormControlLabel, TextField, Select, MenuItem, FormControl,
  InputLabel, Divider
} from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import {
  Emergency, NotificationsActive, Error as ErrorIcon, CheckCircle, Send
} from '@mui/icons-material';

// Define the shape of a single alert object
interface EmergencyAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  message: string;
  timestamp: Date;
  channels: string[];
  recipients: number;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
}

export const EmergencyAlertEngine: React.FC = () => {
  // State for alert history, configuration, and the new alert form
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [alertConfig, setAlertConfig] = useState({
    sms: true, whatsapp: true, email: true, autoTrigger: true, severityThreshold: 'high'
  });
  const [newAlert, setNewAlert] = useState({
    location: '', severity: 'high' as EmergencyAlert['severity'], customMessage: ''
  });

  // Main logic function to trigger an alert
  const triggerEmergencyAlert = async () => {
    const alert: EmergencyAlert = {
      id: new Date().toISOString(),
      severity: newAlert.severity,
      location: newAlert.location,
      message: newAlert.customMessage || generateAutoMessage(newAlert.severity, newAlert.location),
      timestamp: new Date(),
      channels: getActiveChannels(),
      recipients: 5000, // Mock recipients
      status: 'pending'
    };

    setAlerts(prev => [alert, ...prev]);

    // Simulate the alert sending process with timed status updates
    setTimeout(() => {
      setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, status: 'sent' } : a));
      setTimeout(() => {
        setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, status: 'delivered' } : a));
      }, 2000);
    }, 1000);
  };

  // Helper functions to generate dynamic content
  const generateAutoMessage = (severity: string, location: string): string => {
    const messages: { [key: string]: string } = {
      low: `LOW ALERT: Elevated heavy metal levels detected in ${location}. Monitor for updates.`,
      medium: `MEDIUM ALERT: Significant contamination in ${location}. Avoid drinking tap water until further notice.`,
      high: `HIGH ALERT - DANGER: High pollution levels in ${location}. Seek alternative water sources immediately.`,
      critical: `CRITICAL EMERGENCY: Severe contamination in ${location}. DO NOT USE WATER for any purpose. Follow official instructions.`
    };
    return messages[severity];
  };

  const getActiveChannels = (): string[] => {
    const channels = [];
    if (alertConfig.sms) channels.push('SMS');
    if (alertConfig.whatsapp) channels.push('WhatsApp');
    if (alertConfig.email) channels.push('Email');
    return channels;
  };
  
  const getSeverityColor = (severity: string): 'info' | 'warning' | 'error' => {
    if (severity === 'low') return 'info';
    if (severity === 'medium') return 'warning';
    return 'error';
  };
  
  const getStatusIcon = (status: string) => {
    if (status === 'pending') return <NotificationsActive color="warning" />;
    if (status === 'sent') return <Send color="info" />;
    if (status === 'delivered') return <CheckCircle color="success" />;
    return <ErrorIcon color="error" />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Emergency Alert System</Typography>
      <Alert severity="error" sx={{ mb: 3 }}>
        AI-powered emergency alerts with multi-channel distribution. Instantly notify communities when dangerous pollution levels are detected.
      </Alert>

      {/* This Box uses Flexbox to create the three-column layout */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>

        {/* === LEFT COLUMN: Configuration (takes up 1/3 of the width) === */}
        <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Alert Configuration</Typography>
              <FormControlLabel control={<Switch checked={alertConfig.sms} onChange={e => setAlertConfig(c => ({...c, sms: e.target.checked}))} />} label="SMS" />
              <FormControlLabel control={<Switch checked={alertConfig.whatsapp} onChange={e => setAlertConfig(c => ({...c, whatsapp: e.target.checked}))} />} label="WhatsApp" />
              <FormControlLabel control={<Switch checked={alertConfig.email} onChange={e => setAlertConfig(c => ({...c, email: e.target.checked}))} />} label="Email" />
              <Divider sx={{ my: 2 }} />
              <FormControlLabel control={<Switch checked={alertConfig.autoTrigger} onChange={e => setAlertConfig(c => ({...c, autoTrigger: e.target.checked}))} />} label="Auto-trigger Alerts" />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Auto-trigger Threshold</InputLabel>
                <Select value={alertConfig.severityThreshold} onChange={e => setAlertConfig(c => ({...c, severityThreshold: e.target.value}))}>
                  <MenuItem value="medium">Medium Severity</MenuItem>
                  <MenuItem value="high">High Severity</MenuItem>
                  <MenuItem value="critical">Critical Severity Only</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Box>

        {/* === MIDDLE COLUMN: Create Alert (takes up 1/3 of the width) === */}
        <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Create Manual Alert</Typography>
              <TextField fullWidth label="Location (e.g., Jaipur)" value={newAlert.location} onChange={e => setNewAlert(a => ({...a, location: e.target.value}))} sx={{ mb: 2 }} />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Severity Level</InputLabel>
                <Select value={newAlert.severity} onChange={e => setNewAlert(a => ({...a, severity: e.target.value as EmergencyAlert['severity']}))}>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
              <TextField fullWidth multiline rows={3} label="Custom Message (optional)" value={newAlert.customMessage} onChange={e => setNewAlert(a => ({...a, customMessage: e.target.value}))} helperText="Leave blank for an AI-generated message" />
              <Button variant="contained" color="error" fullWidth onClick={triggerEmergencyAlert} disabled={!newAlert.location} startIcon={<Emergency />} sx={{ mt: 2 }}>
                Trigger Emergency Alert
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* === RIGHT COLUMN: Alert History (takes up 1/3 of the width) === */}
        <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Alerts</Typography>
              {alerts.length === 0 ? (
                <Typography variant="body2" color="textSecondary">No alerts sent yet.</Typography>
              ) : (
                <Timeline sx={{p: 0, [`& .MuiTimelineItem-root::before`]: { flex: 0, padding: 0 }}}>
                  {alerts.slice(0, 4).map((alert, index) => (
                    <TimelineItem key={alert.id}>
                      <TimelineSeparator>
                        <TimelineDot color={getSeverityColor(alert.severity)}>
                          {getStatusIcon(alert.status)}
                        </TimelineDot>
                        {index < 3 && index < alerts.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography fontWeight="bold">{alert.location}</Typography>
                        <Typography variant="body2" color="textSecondary">{alert.message.substring(0, 50)}...</Typography>
                        <Chip label={alert.status} size="small" variant="outlined" sx={{mt: 1}} />
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};