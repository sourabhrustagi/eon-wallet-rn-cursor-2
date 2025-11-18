import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState, User } from '../types';
import { authAPI } from '../api/auth.api';
import { secureStorage } from '@/core/storage/secure-storage';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.success && response.data) {
        // Save token to secure storage
        await secureStorage.saveToken(response.data.token);
        
        // Optionally save user data to secure storage
        await secureStorage.saveUser(JSON.stringify(response.data.user));
        
        return {
          user: response.data.user,
          token: response.data.token,
        };
      } else {
        return rejectWithValue(response.message || 'Login failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error. Please try again.');
    }
  }
);

// Thunk to load auth state from secure storage on app start
export const loadAuthFromStorage = createAsyncThunk(
  'auth/loadFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      const token = await secureStorage.getToken();
      const userString = await secureStorage.getUser();
      
      if (token && userString) {
        const user: User = JSON.parse(userString);
        return {
          user,
          token,
        };
      }
      
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load auth data');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      // Clear secure storage (async, but we don't wait)
      secureStorage.clearAll();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginAsync.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      .addCase(loadAuthFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

