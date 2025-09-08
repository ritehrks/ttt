import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, TextField, Button,
  Alert, List, ListItem, ListItemIcon, ListItemText, Chip,
  LinearProgress, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import {
  CheckCircle, Warning, Error as ErrorIcon, DataUsage
} from '@mui/icons-material';
import { AIService } from '../../../services/aiService';

// Define the shape of a single quality check result
interface DataQualityResult {
  parameter: string;
  value: number;
  isValid: boolean;
  confidence: number;
  suggestion: string;
}

export const DataQualityChecker: React.FC = () => {
  // State for the user's input fields
  const [inputData, setInputData] = useState({
    arsenic: '', lead: '', mercury: '', iron: '', uranium: ''
  });
  
  // State for the results and loading status
  const [qualityResults, setQualityResults] = useState<DataQualityResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [overallQuality, setOverallQuality] = useState<number>(0);

  const aiService = AIService.getInstance();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const checkDataQuality = async () => {
    setIsChecking(true);
    setQualityResults([]);
    try {
      const readings = Object.values(inputData).map(val => parseFloat(val) || 0);
      
      const validation = await aiService.validateDataQuality(readings);
      
      const parameters = Object.keys(inputData);
      const results: DataQualityResult[] = parameters.map((param, index) => ({
        parameter: param.charAt(0).toUpperCase() + param.slice(1),
        value: readings[index],
        isValid: validation.isValid,
        confidence: validation.confidence,
        suggestion: generateSuggestion(param, readings[index], validation.confidence)
      }));
      
      setQualityResults(results);
      setOverallQuality(validation.confidence * 100);
    } catch (error) {
      console.error('Data quality check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const generateSuggestion = (parameter: string, value: number, confidence: number): string => {
    if (confidence < 0.3) return `${parameter} reading appears highly suspicious. Please re-test immediately.`;
    if (confidence < 0.6) return `${parameter} reading needs verification. Check calibration of equipment.`;
    if (confidence < 0.8) return `${parameter} reading is acceptable but monitor for trends.`;
    return `${parameter} reading passes all quality checks.`;
  };

  const getQualityColor = (confidence: number): 'success' | 'warning' | 'error' => {
    if (confidence > 80) return 'success';
    if (confidence > 60) return 'warning';
    return 'error';
  };

  const getQualityIcon = (confidence: number) => {
    if (confidence > 80) return <CheckCircle color="success" />;
    if (confidence > 60) return <Warning color="warning" />;
    return <ErrorIcon color="error" />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Smart Data Quality Checker</Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        AI automatically detects suspicious or incorrect data entries. Enter your readings for intelligent validation.
      </Alert>

      {/* This Box uses Flexbox to create the two-column layout */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        
        {/* === LEFT COLUMN: Data Input & Overall Score (50% width on md screens) === */}
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Enter Water Quality Data (µg/L)</Typography>
              {/* This Box creates the two-column layout for the input fields */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {Object.keys(inputData).map((key) => (
                  <Box key={key} sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                    <TextField fullWidth label={key.charAt(0).toUpperCase() + key.slice(1)} name={key} value={(inputData as any)[key]} onChange={handleInputChange} type="number" variant="outlined" />
                  </Box>
                ))}
              </Box>
              <Button variant="contained" fullWidth onClick={checkDataQuality} disabled={isChecking} startIcon={<DataUsage />} sx={{ mt: 3 }}>
                {isChecking ? 'AI Analyzing...' : 'Run Quality Check'}
              </Button>
            </CardContent>
          </Card>

          {qualityResults.length > 0 && !isChecking && (
            <Card elevation={3} sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6">Overall Data Quality Score</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Typography variant="h3" color={getQualityColor(overallQuality)} sx={{ mr: 2 }}>{overallQuality.toFixed(1)}%</Typography>
                  <Chip label={overallQuality > 80 ? 'High Quality' : 'Needs Review'} color={getQualityColor(overallQuality)} />
                </Box>
                <LinearProgress variant="determinate" value={overallQuality} color={getQualityColor(overallQuality)} sx={{ height: 10, borderRadius: 5, mt: 1 }} />
              </CardContent>
            </Card>
          )}
        </Box>
        
        {/* === RIGHT COLUMN: Analysis Results (50% width on md screens) === */}
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          {isChecking && <LinearProgress />}
          {qualityResults.length > 0 && !isChecking && (
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>AI Quality Analysis Results</Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead><TableRow><TableCell>Parameter</TableCell><TableCell>Value</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
                    <TableBody>
                      {qualityResults.map((result) => (
                        <TableRow key={result.parameter}>
                          <TableCell>{result.parameter}</TableCell>
                          <TableCell>{result.value}</TableCell>
                          <TableCell>{getQualityIcon(result.confidence * 100)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <List sx={{ mt: 2 }}>
                  {qualityResults.map((result) => (
                    <ListItem key={result.parameter}>
                      <ListItemIcon>{getQualityIcon(result.confidence * 100)}</ListItemIcon>
                      <ListItemText primary={result.parameter} secondary={result.suggestion} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
};