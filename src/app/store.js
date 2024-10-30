import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../features/api/baseApi";
import auth from "../features/slices/authSlice";

export const reducers = combineReducers({
  auth,
  [baseApi.reducerPath]: baseApi.reducer,
});

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
