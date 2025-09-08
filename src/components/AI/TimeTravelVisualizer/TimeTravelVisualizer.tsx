import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, Typography, Box, Slider,
  IconButton, Alert
} from '@mui/material';
import {
  PlayArrow, Pause, Stop
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

interface TimePoint {
  year: number;
  month: number;
  data: {
    locations: Array<{ lat: number; lng: number; hmpi: number; }>;
    averageHMPI: number;
  };
}

export const TimeTravelVisualizer: React.FC = () => {
  const [timePoints, setTimePoints] = useState<TimePoint[]>([]);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const generateHistoricalData = () => {
      const data: TimePoint[] = [];
      for (let year = 2019; year <= 2025; year++) {
        for (let month = 1; month <= 12; month++) {
          if (year === 2025 && month > new Date().getMonth() + 1) break;
          const locations = Array.from({ length: 50 }, () => {
            const baseHMPI = 30 + Math.random() * 70;
            const trend = (year - 2019) * 5 + Math.sin((month / 12) * 2 * Math.PI) * 10;
            return {
              lat: 20 + Math.random() * 10,
              lng: 75 + Math.random() * 15,
              hmpi: Math.max(0, baseHMPI + trend + (Math.random() - 0.5) * 20),
            };
          });
          const averageHMPI = locations.reduce((sum, loc) => sum + loc.hmpi, 0) / locations.length;
          data.push({ year, month, data: { locations, averageHMPI } });
        }
      }
      setTimePoints(data);
    };
    generateHistoricalData();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTimeIndex(prev => {
          if (prev >= timePoints.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / playSpeed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, playSpeed, timePoints.length]);

  const currentTime = timePoints[currentTimeIndex];

  const formatTimeLabel = (timePoint: TimePoint): string => {
    if (!timePoint) return '';
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[timePoint.month - 1]} ${timePoint.year}`;
  };

  const getMarkerColor = (hmpi: number): string => {
    if (hmpi > 100) return '#f44336';
    if (hmpi > 50) return '#ff9800';
    return '#4caf50';
  };
  
  const customMarkerIcon = (hmpi: number) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${getMarkerColor(hmpi)}; width: 12px; height: 12px; border-radius: 50%; border: 1px solid white;"></div>`,
      iconSize: [12, 12]
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Time-Travel Pollution Analysis</Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        Use the timeline slider and controls to visualize how pollution patterns have evolved over the years.
      </Alert>

      {/* === TOP ROW: Time Controls === */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <IconButton onClick={() => setIsPlaying(p => !p)} color="primary" disabled={currentTimeIndex >= timePoints.length - 1}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton onClick={() => { setIsPlaying(false); setCurrentTimeIndex(0); }}><Stop /></IconButton>
            <Slider sx={{ flexGrow: 1, minWidth: 200 }} value={currentTimeIndex} onChange={(_, val) => setCurrentTimeIndex(val as number)} max={timePoints.length - 1} />
            <Typography variant="h6">{formatTimeLabel(currentTime)}</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* === BOTTOM ROW: Map and Chart === */}
      {/* This Box uses Flexbox to create the two-column layout */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        
        {/* Left Column: Map (takes up 2/3 of the width on medium screens and up) */}
        <Box sx={{ flex: { md: 2 }, width: '100%' }}>
          <Card elevation={3} sx={{ height: 500 }}>
            {currentTime && (
              <MapContainer center={[23.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }} key={currentTimeIndex}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                {currentTime.data.locations.map((loc, index) => (
                  <Marker key={index} position={[loc.lat, loc.lng]} icon={customMarkerIcon(loc.hmpi)}>
                    <Popup>HMPI: {loc.hmpi.toFixed(1)}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </Card>
        </Box>

        {/* Right Column: Chart (takes up 1/3 of the width on medium screens and up) */}
        <Box sx={{ flex: { md: 1 }, width: '100%' }}>
          <Card elevation={3} sx={{ height: 500 }}>
            <CardContent>
              <Typography variant="h6">Pollution Trend</Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer>
                  <AreaChart data={timePoints}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tickFormatter={(_, index) => index % 12 === 0 ? timePoints[index].year.toString() : ''} />
                    <YAxis />
                    <RechartsTooltip labelFormatter={(_, payload) => formatTimeLabel(payload?.[0]?.payload)} />
                    <Area type="monotone" dataKey="data.averageHMPI" name="Average HMPI" stroke="#1976d2" fill="#1976d2" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};