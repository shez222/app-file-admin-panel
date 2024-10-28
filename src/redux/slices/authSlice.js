// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Async thunk for admin login
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const data = response.data;
      // Store token in localStorage
      localStorage.setItem('adminToken', data.token);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  }
);

// Async thunk for admin registration
export const registerAdmin = createAsyncThunk(
  'auth/registerAdmin',
  async ({ name, email, password }, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/auth/register', { name, email, password });
      const data = response.data;
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  }
);

// Async thunk for admin logout
export const logoutAdmin = createAsyncThunk('auth/logoutAdmin', async () => {
  // Remove token from localStorage
  localStorage.removeItem('adminToken');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    admin: null,
    token: localStorage.getItem('adminToken') || null,
    isAuthenticated: !!localStorage.getItem('adminToken'),
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.admin = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
