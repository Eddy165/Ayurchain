import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState, LoginPayload, RegisterPayload, User } from "../types";
import { authAPI } from "../api/axiosInstance";

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("ayurchain_token") || null,
  isAuthenticated: !!localStorage.getItem("ayurchain_token"),
  loading: false,
  error: null,
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(payload);
      return response; // expects { user, token }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Login failed");
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Registration failed");
    }
  }
);

export const getMeThunk = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getMe();
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Failed to fetch user");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("ayurchain_token");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (action.payload.token) {
          localStorage.setItem("ayurchain_token", action.payload.token);
        }
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (action.payload.token) {
          localStorage.setItem("ayurchain_token", action.payload.token);
        }
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // GetMe
    builder
      .addCase(getMeThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload as User;
      })
      .addCase(getMeThunk.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("ayurchain_token");
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export const selectAuth = (state: { auth: AuthState }) => state.auth;

export default authSlice.reducer;
