import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  userId: localStorage.getItem("userId") || null,
  role: localStorage.getItem("role") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
      state.userId = action.payload.id;

      const { role } = jwtDecode(action.payload.token);
      state.role = role;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userId", action.payload.id);
      localStorage.setItem("role", role);
    },
    setUser: (state, action) => {
      const newUser = action.payload;
      state.user = newUser;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;
      state.role = null;

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectUserId = (state) => state.auth.userId;
export const selectRole = (state) => state.auth.role;
