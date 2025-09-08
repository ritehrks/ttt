import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// AI Feature Slices
import aiPredictionsSlice from './slices/aiPredictionsSlice';
import dataQualitySlice from './slices/dataQualitySlice';
import alertSystemSlice from './slices/alertSystemSlice';
import citizenReportsSlice from './slices/citizenReportsSlice';
import sourceDetectionSlice from './slices/sourceDetectionSlice';
import healthRiskSlice from './slices/healthRiskSlice';

// Core Feature Slices
import dashboardSlice from './slices/dashboardSlice';
import mapSlice from './slices/mapSlice';
import calculatorSlice from './slices/calculatorSlice';
import analyticsSlice from './slices/analyticsSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['dashboard', 'calculator'] // Only dashboard and calculator state will be persisted
};

// NOTE: We are creating dummy reducers for the slices we haven't created yet.
// We will replace these later.
const createDummySlice = (name: string) => ({ name, reducer: (state = {}) => state });
const dummySlices = {
  dataQuality: dataQualitySlice,
  alertSystem: alertSystemSlice,
  citizenReports: citizenReportsSlice,
  sourceDetection: sourceDetectionSlice,
  healthRisk: healthRiskSlice,
  dashboard: dashboardSlice,
  map: mapSlice,
  calculator: calculatorSlice,
  analytics: analyticsSlice,
};
for (const key in dummySlices) {
  // @ts-ignore
  if (dummySlices[key].name === 'dummy') {
    // @ts-ignore
    dummySlices[key] = createDummySlice(key).reducer;
  }
}

export const store = configureStore({
  reducer: {
    // AI Features
    aiPredictions: aiPredictionsSlice,
    dataQuality: dummySlices.dataQuality,
    alertSystem: dummySlices.alertSystem,
    citizenReports: dummySlices.citizenReports,
    sourceDetection: dummySlices.sourceDetection,
    healthRisk: dummySlices.healthRisk,

    // Core Features
    dashboard: dummySlices.dashboard,
    map: dummySlices.map,
    calculator: dummySlices.calculator,
    analytics: dummySlices.analytics,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;