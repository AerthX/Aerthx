import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../../utils/api";

const API_URL = import.meta.env.VITE_API_URL;



export const registerOrganization = createAsyncThunk(
  "auth/registerOrganization",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/organization/register`, formData);
      const { token, org } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(org));
      localStorage.setItem("userType", "organization");
      return { token, user: org, userType: "organization" };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Registration failed"
      );
    }
  }
);

export const loginOrganization = createAsyncThunk(
  "auth/loginOrganization",
  async ({ email, password }, { rejectWithValue }) => {
    try {
     const response = await api.post(`/organization/login`, { email, password });
     const { accessToken, refreshToken, org } = response.data;

const finalUser = org;

localStorage.setItem("accessToken", accessToken);
localStorage.setItem("refreshToken", refreshToken);
localStorage.setItem("user", JSON.stringify(finalUser));
localStorage.setItem("userType", "organization");
 
      return {
  accessToken,
  refreshToken,
  user: finalUser,
  userType: "organization",
};
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  }
);

export const verifyOtpAction = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp, form, userType }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        email,
        otp,
        form,
        userType,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userType", userType);

      return { token, user, userType };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "OTP verification failed"
      );
    }
  }
);

export const registerIndividual = createAsyncThunk(
  "auth/registerIndividual",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/individual/register`, formData);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userType", "individual");
      return { token, user, userType: "individual" };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Registration failed"
      );
    }
  }
);

export const loginIndividual = createAsyncThunk(
  "auth/loginIndividual",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/individual/login`, { email, password });
     const { accessToken, refreshToken, user } = response.data;

localStorage.setItem("accessToken", accessToken);
localStorage.setItem("refreshToken", refreshToken);
localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("forceReload", Date.now().toString());
      localStorage.setItem("userType", "individual");
 
     return {
  accessToken,
  refreshToken,
  user,
  userType: "individual",
};
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: {
user: (() => {
  try {
    const u = localStorage.getItem("user");
    return u && u !== "undefined" ? JSON.parse(u) : null;
  } catch {
    return null;
  }
})(),
 token: localStorage.getItem("accessToken"),
  userType: localStorage.getItem("userType") || null,
  isLoggedIn: !!localStorage.getItem("accessToken"),
  isAuthModalOpen: false,
  loading: false,
  error: null,
},
reducers: {
   login: (state) => {
      state.isLoggedIn = true;
    },
    openAuthModal: (state) => {
      state.isAuthModalOpen = true;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
  logout(state) {
    state.user = null;
    state.token = null;
    state.userType = null;
    state.isLoggedIn = false;
    localStorage.removeItem("accessToken");
localStorage.removeItem("refreshToken");
localStorage.removeItem("user");
localStorage.removeItem("userType");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    
     const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = `${import.meta.env.VITE_CLIENT_URL}/logout`;
  document.body.appendChild(iframe);

  },
  setUser(state, action) {
    state.user = action.payload;
  },
    setToken(state, action) {
    state.token = action.payload;
  },
  setUserType(state, action) {
    state.userType = action.payload;
  },

},

  extraReducers: (builder) => {
    builder

      .addCase(registerOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerOrganization.fulfilled, (state, action) => {
        state.loading = false;
          state.user = action.payload.user;
        state.token = action.payload.token;
        state.userType = action.payload.userType;
        state.isLoggedIn = true;
      })
      .addCase(registerOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verifyOtpAction.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(verifyOtpAction.fulfilled, (state, action) => {
  state.loading = false;
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.userType = action.payload.userType;
  state.isLoggedIn = true;
})
.addCase(verifyOtpAction.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})  

      .addCase(loginOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
       state.token = action.payload.accessToken;
        state.userType = action.payload.userType;
        state.isLoggedIn = true;
      })
      .addCase(loginOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerIndividual.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerIndividual.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userType = action.payload.userType;
        state.isLoggedIn = true;
      })
      .addCase(registerIndividual.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginIndividual.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      
      .addCase(loginIndividual.fulfilled, (state, action) => {
  state.loading = false;
  state.user = action.payload.user;
state.token = action.payload.accessToken;
  state.userType = action.payload.userType;
  state.isLoggedIn = true;
})
     .addCase(loginIndividual.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
  state.user = null; 
})

  },
});

export const { login, logout, openAuthModal, closeAuthModal, setUser, setToken, setUserType  } = authSlice.actions;
export default authSlice.reducer;
