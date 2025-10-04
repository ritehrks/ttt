import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, TextField, Button, CircularProgress, Chip, Collapse, Alert
} from '@mui/material';
import { UploadFile, Calculate, CheckCircleOutline, ErrorOutline, CloudUpload } from '@mui/icons-material';

// This component encapsulates the entire data submission process
export const DataSubmissionWorkflow: React.FC = () => {
  const [step, setStep] = useState(1); // 1: Input, 2: Analyzing, 3: Review
  const [fileName, setFileName] = useState<string | null>(null);
  const [hmpiResult, setHmpiResult] = useState<number | null>(null);
  const [dataQuality, setDataQuality] = useState<{ status: 'valid' | 'invalid'; message: string } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    }
  };

  const handleCalculate = () => {
    if (!fileName) return; // Basic validation
    setStep(2); // Move to the "analyzing" step

    // Simulate API calls for HMPI calculation and data quality check
    setTimeout(() => {
      // Simulate receiving results
      setHmpiResult(128.7);
      setDataQuality({ status: 'valid', message: 'Data is consistent with historical records for this location.' });
      setStep(3); // Move to the "review" step
    }, 2500); // 2.5-second delay to simulate processing
  };

  const handleSubmit = () => {
    // Here you would dispatch an action to submit the data to your backend
    console.log("Submitting data...");
    // Reset the form after submission
    setStep(1);
    setFileName(null);
    setHmpiResult(null);
    setDataQuality(null);
  };

  return (
    <Card
      elevation={6}
      sx={{
        width: '100%',
        mb: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        overflow: 'hidden', // Ensures smooth transitions
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#000', fontWeight: 'bold' }}>
          Submit New Water Quality Data
        </Typography>

        {/* Step 1: Data Input */}
        <Collapse in={step === 1 || step === 2} timeout={500}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <TextField label="Location ID" variant="outlined" size="small" sx={{ flexGrow: 1 }} disabled={step === 2} />
            <Button variant="outlined" component="label" startIcon={<UploadFile />} sx={{ flexGrow: 1 }} disabled={step === 2}>
              {fileName || 'Upload CSV'}
              <input type="file" hidden accept=".csv" onChange={handleFileChange} />
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={step === 2 ? <CircularProgress size={20} color="inherit" /> : <Calculate />}
              onClick={handleCalculate}
              disabled={!fileName || step === 2}
              sx={{ flexGrow: 1, fontWeight: 'bold' }}
            >
              {step === 2 ? 'Analyzing...' : 'Calculate HMPI'}
            </Button>
          </Box>
        </Collapse>

        {/* Step 3: Review Results */}
        <Collapse in={step === 3} timeout={500}>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', p: 2, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 1 }}>
              <Box textAlign="center">
                <Typography variant="subtitle1" color="text.secondary">Calculated HMPI</Typography>
                <Chip label={hmpiResult} color="error" sx={{ fontSize: '1.5rem', p: 2, mt: 1 }} />
              </Box>
              <Box textAlign="center">
                <Typography variant="subtitle1" color="text.secondary">Data Quality Check</Typography>
                <Chip
                  icon={dataQuality?.status === 'valid' ? <CheckCircleOutline /> : <ErrorOutline />}
                  label={dataQuality?.status === 'valid' ? 'Valid' : 'Invalid'}
                  color={dataQuality?.status === 'valid' ? 'success' : 'warning'}
                  sx={{ mt: 1, p: 2 }}
                />
              </Box>
            </Box>
            <Alert severity={dataQuality?.status === 'valid' ? 'success' : 'warning'} sx={{ mt: 2 }}>
              {dataQuality?.message}
            </Alert>
            <Button
              variant="contained"
              color="success"
              startIcon={<CloudUpload />}
              onClick={handleSubmit}
              fullWidth
              sx={{ mt: 2, fontWeight: 'bold' }}
            >
              Submit Verified Data
            </Button>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};