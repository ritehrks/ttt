import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Slider, Button,
  Alert, Paper, Chip, LinearProgress
} from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import {
  HealthAndSafety, People, Timeline as TimelineIcon
} from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AIService } from '../../../services/aiService';

// Define the shape of a single health prediction result
interface HealthPrediction {
  timeframe: string;
  riskIncrease: number;
  affectedPopulation: number;
  confidence: number;
  severity: string;
  diseases: string[];
}

export const PredictiveHealthAssessment: React.FC = () => {
  // State for user inputs
  const [hmpiValue, setHmpiValue] = useState<number>(75);
  const [population, setPopulation] = useState<number>(100000);

  // State for the results and loading status
  const [predictions, setPredictions] = useState<HealthPrediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [riskTrendData, setRiskTrendData] = useState<any[]>([]);

  const aiService = AIService.getInstance();

  const runHealthAnalysis = async () => {
    setIsAnalyzing(true);
    setPredictions([]);
    try {
      const timeframes = ['6months', '1year', '5years'];
      const newPredictions: HealthPrediction[] = [];

      for (const tf of timeframes) {
        const result = await aiService.assessHealthRisk(hmpiValue, population, tf);
        newPredictions.push({
          timeframe: tf,
          riskIncrease: result.riskIncrease,
          affectedPopulation: Math.round(population * (result.riskIncrease / 100)),
          confidence: result.confidence,
          severity: result.severity,
          diseases: getDiseasesByRisk(result.riskIncrease)
        });
      }
      setPredictions(newPredictions);
      generateRiskTrendData(newPredictions);
    } catch (error) {
      console.error('Health analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper functions to process and format data
  const getDiseasesByRisk = (riskLevel: number): string[] => {
    const allDiseases = ['Kidney Disease', 'Cardiovascular Issues', 'Neurological Disorders', 'Liver Problems', 'Cancer Risk'];
    const diseaseCount = Math.ceil((riskLevel / 100) * allDiseases.length);
    return allDiseases.slice(0, diseaseCount);
  };
  
  const generateRiskTrendData = (preds: HealthPrediction[]) => {
    const trendData = [
      { month: 0, risk: 0, population: 0 },
      { month: 6, risk: preds[0]?.riskIncrease || 0, population: preds[0]?.affectedPopulation || 0 },
      { month: 12, risk: preds[1]?.riskIncrease || 0, population: preds[1]?.affectedPopulation || 0 },
      { month: 60, risk: preds[2]?.riskIncrease || 0, population: preds[2]?.affectedPopulation || 0 },
    ];
    setRiskTrendData(trendData);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'success';
      case 'moderate': return 'info';
      case 'high': return 'warning';
      case 'critical': return 'error';
      default: return 'primary';
    }
  };

  const formatTimeframe = (timeframe: string) => {
    if (timeframe === '6months') return '6 Months';
    if (timeframe === '1year') return '1 Year';
    if (timeframe === '5years') return '5 Years';
    return timeframe;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>AI-Powered Health Risk Assessment</Typography>
      <Alert severity="warning" sx={{ mb: 3 }}>
        AI predicts future health impacts based on current pollution levels. Adjust the sliders and run the analysis for preventive action planning.
      </Alert>

      {/* This Box uses Flexbox to create the two-column layout */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
        
        {/* === LEFT COLUMN: Input Parameters (takes up 1/3 of the width on md screens) === */}
        <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Analysis Parameters</Typography>
              <Box sx={{ mb: 3, p: 2 }}>
                <Typography gutterBottom>Current HMPI Value: {hmpiValue}</Typography>
                <Slider value={hmpiValue} onChange={(_, value) => setHmpiValue(value as number)} min={0} max={200} step={5} />
              </Box>
              <Box sx={{ mb: 3, p: 2 }}>
                <Typography gutterBottom>Affected Population: {population.toLocaleString()}</Typography>
                <Slider value={population} onChange={(_, value) => setPopulation(value as number)} min={1000} max={1000000} step={1000} />
              </Box>
              <Button variant="contained" fullWidth onClick={runHealthAnalysis} disabled={isAnalyzing} startIcon={<HealthAndSafety />}>
                {isAnalyzing ? 'Analyzing...' : 'Run AI Health Analysis'}
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* === RIGHT COLUMN: Prediction Results (takes up 2/3 of the width on md screens) === */}
        <Box sx={{ width: { xs: '100%', md: '66.67%' }, mt: { xs: 3, md: 0 } }}>
          <Typography variant="h6" gutterBottom>AI Health Impact Predictions</Typography>
          {isAnalyzing && <LinearProgress />}
          {!isAnalyzing && predictions.length === 0 && <Alert severity="info">Run the analysis to see AI predictions.</Alert>}
          
          <Timeline position="alternate">
            {predictions.map((pred, index) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot color={getSeverityColor(pred.severity) as any}><TimelineIcon /></TimelineDot>
                  {index < predictions.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6">{formatTimeframe(pred.timeframe)}</Typography>
                    <Typography variant="h4" color={`${getSeverityColor(pred.severity)}.main`}>+{pred.riskIncrease.toFixed(1)}%</Typography>
                    <Typography variant="body2" gutterBottom>Increase in Health Issues</Typography>
                    <Chip label={`${pred.severity} Risk`} color={getSeverityColor(pred.severity) as any} size="small" />
                    <Typography variant="body2" sx={{ mt: 1 }}><People sx={{ verticalAlign: 'middle', mr: 0.5 }} /> Affected: {pred.affectedPopulation.toLocaleString()}</Typography>
                    <Box sx={{ mt: 1 }}>
                      {pred.diseases.map(d => <Chip key={d} label={d} size="small" variant="outlined" sx={{ mr: 0.5, mt: 0.5 }} />)}
                    </Box>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Box>
      </Box>
      
      {/* === BOTTOM ROW: Trend Chart === */}
      {riskTrendData.length > 0 && (
        <Box>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Projected Health Risk Timeline</Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={riskTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="risk" name="Risk Increase" stroke="#f44336" fill="#f44336" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};