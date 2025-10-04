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
import { DataSubmissionWorkflow } from './DataSubmissionWorkflow';

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

export const MainDashboard: React.FC = () => {
  // Mock data for the dashboard
  const [dashboardData] = useState({
    nationalAverage: 68.4,
    monitoringLocations: '15,259',
    pollutionDistribution: [
      { name: 'Safe', value: 8543, color: '#4caf50' },
      { name: 'Moderate', value: 4892, color: '#ff9800' },
      { name: 'Polluted', value: 1824, color: '#f44336' },
    ],
    topPollutedLocations: [
      { state: 'Punjab', district: 'Jalandhar', hmpi: 145.2, trend: '+8%' },
      { state: 'Haryana', district: 'Kurukshetra', hmpi: 138.7, trend: '+12%' },
      { state: 'Rajasthan', district: 'Jodhpur', hmpi: 132.1, trend: '+5%' },
    ]
  });

  // Using static data to avoid build errors.
  const alertCount = 2;
  const citizenReportsCount = 3;

  return (
    <Box sx={{ p: 3, color: 'text.primary' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#ffffffff' }}>
        SWASTH Dashboard
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>AI Status:</strong> All systems operational. Monitoring {dashboardData.monitoringLocations} locations nationwide.
      </Alert>

      {/* The new multi-step data submission component */}
      <DataSubmissionWorkflow />

      {/* Layout for the stats cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>

        <Box sx={{ p: 1.5, width: { xs: '100%', sm: '50%', md: '25%' } }}>
          <QuickStatCard title="National HMPI Average" value={dashboardData.nationalAverage} subtitle="Moderate quality" icon={<Science />} color="warning" />
        </Box>
        <Box sx={{ p: 1.5, width: { xs: '100%', sm: '50%', md: '25%' } }}>
          <QuickStatCard title="Active Alerts" value={alertCount} subtitle="Emergency notifications" icon={<Emergency />} color="error" />
        </Box>
        <Box sx={{ p: 1.5, width: { xs: '100%', sm: '50%', md: '25%' } }}>
          <QuickStatCard title="Citizen Reports" value={citizenReportsCount} subtitle="Community submissions" icon={<AI />} color="info" />
        </Box>
        <Box sx={{ p: 1.5, width: { xs: '100%', sm: '50%', md: '25%' } }}>
          <QuickStatCard title="Monitoring Locations" value={dashboardData.monitoringLocations} subtitle="CGWB network" icon={<LocationOn />} color="primary" />
        </Box>

        {/* Layout for the chart and table */}
        <Box sx={{ p: 1.5, width: { xs: '100%', lg: '50%' } }}>
          <Card elevation={3} sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <CardContent>
              <Typography variant="h6" sx={{color: '#000'}}>National Pollution Distribution</Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={dashboardData.pollutionDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={(props) => `${props.name} ${props.percent ? (props.percent * 100).toFixed(0) : 0}%`}>
                      {dashboardData.pollutionDistribution.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ p: 1.5, width: { xs: '100%', lg: '50%' } }}>
          <Card elevation={3} sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <CardContent>
              <Typography variant="h6" sx={{color: '#000'}}>Top Polluted Locations (Attention Required)</Typography>
              <TableContainer component={Paper} elevation={0} sx={{ mt: 2, backgroundColor: 'transparent' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>State</TableCell>
                      <TableCell>District</TableCell>
                      <TableCell>HMPI</TableCell>
                      <TableCell>Trend</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.topPollutedLocations.map((loc) => (
                      <TableRow key={loc.district}>
                        <TableCell>{loc.state}</TableCell>
                        <TableCell>{loc.district}</TableCell>
                        <TableCell><Chip label={loc.hmpi} color="error" /></TableCell>
                        <TableCell sx={{ color: 'error.main' }}>{loc.trend}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};