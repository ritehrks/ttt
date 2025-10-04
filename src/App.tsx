import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';

// Layout
import { MainLayout } from './components/Layout/MainLayout';

// Pages
import { MainDashboard } from './components/Dashboard/MainDashboard';
import { SmartContaminationDetector } from './components/AI/SmartContaminationDetector/SmartContaminationDetector';
import { PredictiveHealthAssessment } from './components/AI/PredictiveHealthAssessment/PredictiveHealthAssessment';
import { DataQualityChecker } from './components/AI/DataQualityChecker/DataQualityChecker';
import { EmergencyAlertEngine } from './components/AI/EmergencyAlertEngine/EmergencyAlertEngine';
import { TimeTravelVisualizer } from './components/AI/TimeTravelVisualizer/TimeTravelVisualizer';
import { HMPICalculator } from './components/HMPICalculator/HMPICalculator';

const theme = createTheme({
  palette: {
    primary: { main: '#0a4783ff' },
    secondary: { main: '#00796b' },
    background: {
      default: 'transparent'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: 'transparent',
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<MainDashboard />} />
                <Route path="/calculator" element={<HMPICalculator />} />
                <Route path="/source-detection" element={<SmartContaminationDetector />} />
                <Route path="/health-predictions" element={<PredictiveHealthAssessment />} />
                <Route path="/data-quality" element={<DataQualityChecker />} />
                <Route path="/alerts" element={<EmergencyAlertEngine />} />
                <Route path="/time-travel" element={<TimeTravelVisualizer />} />
                

                {/* Placeholder Routes for unimplemented pages */}
                <Route path="/map" element={<div>Coming Soon</div>} />
                <Route path="/calculator" element={<div>Coming Soon</div>} />
                <Route path="/analytics" element={<div>Coming Soon</div>} />
                <Route path="/ai-center" element={<div>Coming Soon</div>} />
                <Route path="/citizen-reports" element={<div>Coming Soon</div>} />
                <Route path="/settings" element={<div>Coming Soon</div>} />

              </Routes>
            </MainLayout>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
