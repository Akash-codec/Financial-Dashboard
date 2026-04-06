import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardService from './dashboardService';

const initialState = {
  summary: null,
  recentActivity: [],
  categoryTotals: [],
  monthlyTrends: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const fetchDashboardData = createAsyncThunk('dashboard/fetchAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const summary = await dashboardService.getSummary(token);
    const recentActivity = await dashboardService.getRecentActivity(token);
    const categoryTotals = await dashboardService.getCategoryTotals(token);
    const monthlyTrends = await dashboardService.getMonthlyTrends(token);
    
    return { summary, recentActivity, categoryTotals, monthlyTrends };
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.summary = action.payload.summary;
        state.recentActivity = action.payload.recentActivity;
        state.categoryTotals = action.payload.categoryTotals;
        state.monthlyTrends = action.payload.monthlyTrends;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = dashboardSlice.actions;
export default dashboardSlice.reducer;
