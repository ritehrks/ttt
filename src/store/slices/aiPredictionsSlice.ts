import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define the TypeScript shape for a contamination source prediction
interface ContaminationSource {
  id: string;
  type: 'industrial' | 'agricultural' | 'urban' | 'natural';
  location: { lat: number; lng: number };
  confidence: number;
  description: string;
  distance: number;
}

// Define the shape for a health risk prediction
interface HealthRiskPrediction {
  timeframe: '6months' | '1year' | '5years';
  riskIncrease: number;
  affectedPopulation: number;
  diseaseTypes: string[];
  confidence: number;
}

// Define the overall shape of this slice's state
interface AIState {
  contaminationSources: ContaminationSource[];
  healthPredictions: HealthRiskPrediction[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// Define the initial state when the app first loads
const initialState: AIState = {
  contaminationSources: [],
  healthPredictions: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Create an async thunk for fetching contamination sources
export const predictContaminationSources = createAsyncThunk(
  'ai/predictContaminationSources',
  async (locationData: any, thunkAPI) => {
    // In a real app, you would make an API call here.
    // For now, we simulate a successful response with mock data.
    const response = await fetch('/api/ai/predict-sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(locationData)
    });
    return response.json();
  }
);

const aiPredictionsSlice = createSlice({
  name: 'aiPredictions',
  initialState,
  // Reducers for synchronous actions (actions that happen instantly)
  reducers: {
    clearPredictions: (state) => {
      state.contaminationSources = [];
      state.healthPredictions = [];
    },
    updateConfidence: (state, action: PayloadAction<{id: string, confidence: number}>) => {
      const source = state.contaminationSources.find(s => s.id === action.payload.id);
      if (source) {
        source.confidence = action.payload.confidence;
      }
    }
  },
  // Extra reducers for handling the states of our async thunk
  extraReducers: (builder) => {
    builder
      .addCase(predictContaminationSources.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(predictContaminationSources.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contaminationSources = action.payload.sources;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(predictContaminationSources.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch predictions';
      });
  }
});

export const { clearPredictions, updateConfidence } = aiPredictionsSlice.actions;
export default aiPredictionsSlice.reducer;