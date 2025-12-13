import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  submitCardApplication,
  CardApplicationRequest,
  CardApplicationResponse,
} from '../../services/cardApplication';

interface CardApplicationState {
  selectedCardUsage: string[];
  selectedPurposes: string[];
  otherPurpose: string;
  isLoading: boolean;
  error: string | null;
  applicationData: CardApplicationResponse['data'] | null;
  lastSubmittedAt: string | null;
}

const initialState: CardApplicationState = {
  selectedCardUsage: [],
  selectedPurposes: [],
  otherPurpose: '',
  isLoading: false,
  error: null,
  applicationData: null,
  lastSubmittedAt: null,
};

// Async thunk for submitting card application
export const submitApplication = createAsyncThunk(
  'cardApplication/submit',
  async (payload: CardApplicationRequest, { rejectWithValue }) => {
    try {
      const response = await submitCardApplication(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to submit application'
      );
    }
  }
);

const cardApplicationSlice = createSlice({
  name: 'cardApplication',
  initialState,
  reducers: {
    setCardUsage: (state, action: PayloadAction<string[]>) => {
      state.selectedCardUsage = action.payload;
      state.error = null;
    },
    toggleCardUsage: (state, action: PayloadAction<string>) => {
      const usage = action.payload;
      if (state.selectedCardUsage.includes(usage)) {
        state.selectedCardUsage = state.selectedCardUsage.filter((item) => item !== usage);
      } else {
        state.selectedCardUsage = [...state.selectedCardUsage, usage];
      }
      state.error = null;
    },
    setPurposes: (state, action: PayloadAction<string[]>) => {
      state.selectedPurposes = action.payload;
      state.error = null;
    },
    togglePurpose: (state, action: PayloadAction<string>) => {
      const purpose = action.payload;
      if (state.selectedPurposes.includes(purpose)) {
        state.selectedPurposes = state.selectedPurposes.filter((item) => item !== purpose);
        // Clear otherPurpose if "Others" is deselected
        if (purpose === 'Others') {
          state.otherPurpose = '';
        }
      } else {
        state.selectedPurposes = [...state.selectedPurposes, purpose];
      }
      state.error = null;
    },
    setOtherPurpose: (state, action: PayloadAction<string>) => {
      state.otherPurpose = action.payload;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetForm: (state) => {
      state.selectedCardUsage = [];
      state.selectedPurposes = [];
      state.otherPurpose = '';
      state.error = null;
    },
    resetApplication: (state) => {
      state.applicationData = null;
      state.lastSubmittedAt = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applicationData = action.payload.data;
        state.lastSubmittedAt = new Date().toISOString();
        state.error = null;
        // Optionally reset form after successful submission
        // state.selectedCardUsage = [];
        // state.selectedPurposes = [];
        // state.otherPurpose = '';
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCardUsage,
  toggleCardUsage,
  setPurposes,
  togglePurpose,
  setOtherPurpose,
  clearError,
  resetForm,
  resetApplication,
} = cardApplicationSlice.actions;

export default cardApplicationSlice.reducer;

