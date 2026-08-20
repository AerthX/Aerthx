import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";   // adjust path if needed

const API_URL = import.meta.env.VITE_API_URL;

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async ({  userType }, { rejectWithValue }) => {
    try {
     const route =
  userType === "individual"
    ? "individual/profile"
    : userType === "organization"
    ? "organization/profile"
    : null;

if (!route) {
  return rejectWithValue("Unknown user type for profile fetch.");
}


  const res = await api.get(`/${route}`);
      return res.data;
    } catch (err) {
      console.error("Profile fetch error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ token, userType, formData }, { rejectWithValue }) => {
    try {
  const route =
  userType === "individual"
    ? "individual/profile"
    : userType === "organization"
    ? "organization/profile"
    : null;

if (!route) {
  return rejectWithValue("Unknown user type for profile update.");
}


   const res = await api.put(`/${route}`, formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update profile");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {
    clearProfile: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
