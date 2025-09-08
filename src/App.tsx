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

// Define our custom application theme
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#00796b' },
  },
});

const App: React.FC = () => {
  return (
    // Provide the Redux store to the entire app
    <Provider store={store}>
      {/* Persist and rehydrate the store on refresh */}
      <PersistGate loading={null} persistor={persistor}>
        {/* Provide the MUI theme to the entire app */}
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {/* Handle all routing and navigation */}
          <Router>
            {/* Use our main layout to wrap all pages */}
            <MainLayout>
              {/* Define all the application's pages/routes */}
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<MainDashboard />} />
                <Route path="/source-detection" element={<SmartContaminationDetector />} />
                <Route path="/health-predictions" element={<PredictiveHealthAssessment />} />
                <Route path="/data-quality" element={<DataQualityChecker />} />
                <Route path="/alerts" element={<EmergencyAlertEngine />} />
                <Route path="/time-travel" element={<TimeTravelVisualizer />} />
              </Routes>
            </MainLayout>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;