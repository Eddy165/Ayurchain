import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BatchState } from "../types";
import { batchAPI } from "../api/axiosInstance";

const initialState: BatchState = {
  batches: [],
  currentBatch: null,
  loading: false,
  error: null,
};

export const fetchBatchesThunk = createAsyncThunk(
  "batch/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await batchAPI.list();
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Failed to fetch batches");
    }
  }
);

export const fetchBatchHistoryThunk = createAsyncThunk(
  "batch/fetchHistory",
  async (batchId: string, { rejectWithValue }) => {
    try {
      const response = await batchAPI.getHistory(batchId);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Failed to fetch batch history");
    }
  }
);

export const createBatchThunk = createAsyncThunk(
  "batch/create",
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const response = await batchAPI.create(payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Failed to create batch");
    }
  }
);

const batchSlice = createSlice({
  name: "batch",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // List
    builder.addCase(fetchBatchesThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBatchesThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.batches = action.payload;
    });
    builder.addCase(fetchBatchesThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // History (fetch specific batch)
    builder.addCase(fetchBatchHistoryThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.currentBatch = null;
    });
    builder.addCase(fetchBatchHistoryThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.currentBatch = action.payload;
    });
    builder.addCase(fetchBatchHistoryThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create
    builder.addCase(createBatchThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createBatchThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.batches.unshift(action.payload);
    });
    builder.addCase(createBatchThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const selectBatch = (state: { batch: BatchState }) => state.batch;

export default batchSlice.reducer;
