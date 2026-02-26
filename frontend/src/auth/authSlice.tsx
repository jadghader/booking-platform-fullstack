import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User } from "./auth";
import { RootState } from "../store/store";

type AuthState = {
  user: User | null;
  token: string | null;
  email: string | null; // Add email field
};

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null, email: null } as AuthState,
  reducers: {
    setCredentials: (
      state,
      { payload: { token } }: PayloadAction<{ token: string }>
    ) => {

      state.token = token;
    },
    setUser: (state, { payload: { user } }: PayloadAction<{ user: User }>) => {
      state.user = user;
    },
    setEmail: (
      state,
      { payload: { email } }: PayloadAction<{ email: string }>
    ) => {
      state.email = email;
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.email = null; // Clear email when clearing user
    },
  },
});

export const { setCredentials, setUser, clearUser, setEmail } =
  authSlice.actions;

export const authReducer = authSlice.reducer;

export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentEmail = (state: RootState) => state.auth.email;
export const selectUser = (state: RootState) => state.auth.user;
