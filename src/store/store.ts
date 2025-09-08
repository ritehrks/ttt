import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import all our real slice reducers
import aiPredictionsSlice from './slices/aiPredictionsSlice';
import dataQualitySlice from './slices/dataQualitySlice';
import alertSystemSlice from './slices/alertSystemSlice';
import citizenReportsSlice from './slices/citizenReportsSlice';
import sourceDetectionSlice from './slices/sourceDetectionSlice';
import healthRiskSlice from './slices/healthRiskSlice';
import dashboardSlice from './slices/dashboardSlice';
import mapSlice from './slices/mapSlice';
import calculatorSlice from './slices/calculatorSlice';
import analyticsSlice from './slices/analyticsSlice';

// Combine all reducers into one root reducer object
const rootReducer = combineReducers({
  aiPredictions: aiPredictionsSlice,
  dataQuality: dataQualitySlice,
  alertSystem: alertSystemSlice,
  citizenReports: citizenReportsSlice,
  sourceDetection: sourceDetectionSlice,
  healthRisk: healthRiskSlice,
  dashboard: dashboardSlice,
  map: mapSlice,
  calculator: calculatorSlice,
  analytics: analyticsSlice,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['dashboard', 'calculator'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;