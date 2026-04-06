import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from './userService';

const initialState = {
  usersList: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const fetchUsers = createAsyncThunk('users/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await userService.getUsers(token);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateUserRole = createAsyncThunk('users/updateRole', async (userData, thunkAPI) => {
  try {
    const { id, role } = userData;
    const token = thunkAPI.getState().auth.user.token;
    return await userService.updateUserRole(id, role, token);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetUsersState: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.usersList = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateUserRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // update the specific user in the list
        const updatedUser = action.payload.user;
        const index = state.usersList.findIndex(u => u._id === updatedUser._id);
        if (index !== -1) {
          state.usersList[index] = updatedUser;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetUsersState } = userSlice.actions;
export default userSlice.reducer;
