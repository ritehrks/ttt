import { createSlice } from '@reduxjs/toolkit';

// We add `activeAlerts` here because a future component will need it
const initialState = {
  activeAlerts: [],
};

const alertSystemSlice = createSlice({
  name: 'alertSystem',
  initialState,
  reducers: {},
});

export default alertSystemSlice.reducer;