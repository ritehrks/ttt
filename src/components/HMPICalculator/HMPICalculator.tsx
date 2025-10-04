import React, { useState } from 'react';
import {
  Typography,
  Box,
  Alert
} from '@mui/material';
import { DataSubmissionWorkflow } from '../Dashboard/DataSubmissionWorkflow';


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
        <strong>PLEASE PROVIDE DATA:</strong> we will provide you insights on that data {dashboardData.monitoringLocations} locations nationwide.
      </Alert>

      {/* The new multi-step data submission component */}
      <DataSubmissionWorkflow />

    </Box>
  );
};