import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Chip, LinearProgress,
  Alert, Accordion, AccordionSummary, AccordionDetails,
  List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import {
  ExpandMore, Factory, Agriculture, LocationCity, Terrain,
  CheckCircle
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import { AIService } from '../../../services/aiService';

// This is a helper component to handle map clicks correctly in the new version of react-leaflet.
const MapClickHandler = ({ onMapClick }: { onMapClick: (latlng: any) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

export const SmartContaminationDetector: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const aiService = AIService.getInstance();

  const analyzeLocation = async (location: { lat: number, lng: number }) => {
    setSelectedLocation(location);
    setAnalysisResults(null);
    setIsAnalyzing(true);
    
    const mockPollutionData = [0.8, 0.6, 0.3, 0.9, 0.4];
    const geoData = [location.lat, location.lng];
    
    try {
      const prediction = await aiService.predictContaminationSource(mockPollutionData, geoData);
      setAnalysisResults({
        location,
        predictions: [
          { type: 'industrial', confidence: prediction.industrial * 100, icon: <Factory /> },
          { type: 'agricultural', confidence: prediction.agricultural * 100, icon: <Agriculture /> },
          { type: 'urban', confidence: prediction.urban * 100, icon: <LocationCity /> },
          { type: 'natural', confidence: prediction.natural * 100, icon: <Terrain /> },
        ].sort((a, b) => b.confidence - a.confidence),
        recommendations: [ 'Investigate industrial area 2.3km northwest', 'Check agricultural runoff patterns' ]
      });
    } catch (error) {
      console.error('AI analysis failed:', error);
      setAnalysisResults({ error: 'Analysis failed. Please try again.' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceColor = (confidence: number): 'error' | 'warning' | 'info' | 'success' => {
    if (confidence > 80) return 'error';
    if (confidence > 60) return 'warning';
    if (confidence > 40) return 'info';
    return 'success';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Smart Contamination Source Detection</Typography>
      <Alert severity="info" sx={{ mb: 3 }}>Click on the map to get AI-powered source predictions.</Alert>

      {/* This Box uses Flexbox to create the two-column layout */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>

        {/* Left Column: AI Analysis Results (takes up 50% of the width on medium screens and up) */}
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <Card elevation={3} sx={{ minHeight: 500 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>AI Source Detection Results</Typography>
              {!selectedLocation && <Typography color="textSecondary">Click on the map to begin.</Typography>}
              {isAnalyzing && <LinearProgress />}
              {analysisResults && !isAnalyzing && (
                <>
                  {analysisResults.predictions.map((pred: any) => (
                    <Box key={pred.type} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {pred.icon}
                        <Typography sx={{ ml: 1 }}>{pred.type} Source</Typography>
                        <Chip label={`${pred.confidence.toFixed(1)}%`} color={getConfidenceColor(pred.confidence)} size="small" sx={{ ml: 'auto' }} />
                      </Box>
                      <LinearProgress variant="determinate" value={pred.confidence} color={getConfidenceColor(pred.confidence)} />
                    </Box>
                  ))}
                  <Accordion sx={{ mt: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>AI Recommendations</AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {analysisResults.recommendations.map((rec: string, index: number) => (
                          <ListItem key={index}><ListItemIcon><CheckCircle color="primary" /></ListItemIcon><ListItemText primary={rec} /></ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Right Column: Interactive Map (takes up 50% of the width on medium screens and up) */}
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <Card elevation={3}>
            <CardContent sx={{ p: 1 }}>
              <Box sx={{ height: 485, width: '100%' }}>
                <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                  <MapClickHandler onMapClick={analyzeLocation} />
                  {selectedLocation && (
                    <>
                      <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                        <Popup>Analysis Location</Popup>
                      </Marker>
                      <Circle center={[selectedLocation.lat, selectedLocation.lng]} radius={5000} color="red" />
                    </>
                  )}
                </MapContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};