import { createSlice } from '@reduxjs/toolkit';

// We add `reports` here because the dashboard will need to count them
const initialState = {
  reports: 0,
};

const citizenReportsSlice = createSlice({
  name: 'citizenReports',
  initialState,
  reducers: {},
});

export default citizenReportsSlice.reducer;