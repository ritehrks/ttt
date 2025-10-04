import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Alert, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Avatar
} from '@mui/material';
import {
  LocationOn, Science, Emergency, SmartToy as AI
} from '@mui/icons-material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { DataSubmissionWorkflow } from '../Dashboard/DataSubmissionWorkflow';

// A small, reusable component for the stat cards at the top
const QuickStatCard = ({ title, value, subtitle, icon, color = 'primary' }: any) => (
  <Card
    elevation={3}
    sx={{
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="subtitle1">{title}</Typography>
          <Typography variant="h4" component="div" color={`${color}.main`}>{value}</Typography>
          <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
        </Box>
        <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main`, width: 56, height: 56 }}>{icon}</Avatar>
      </Box>
    </CardContent>
  </Card>
);

export const HMPICalculator: React.FC = () => {
  // Mock data for the calculator dashboard
  const [dashboardData] = useState({
    monitoringLocations: '15,259',
  });

  return (
    <Box sx={{ p: 3, color: 'text.primary' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#ffffffff' }}>
        HMPI Calculator
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>PLEASE PROVIDE DATA:</strong> we will provide you insights on that data  {dashboardData.monitoringLocations} locations nationwide.
      </Alert>

      {/* The new multi-step data submission component */}
      <DataSubmissionWorkflow />

    </Box>
  );
};