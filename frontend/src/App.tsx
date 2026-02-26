/* eslint-disable react/no-children-prop */
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./App.css";
import RoutesComponent from "./routes";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  clearUser,
  selectCurrentToken,
  setCredentials,
} from "./auth/authSlice";
import { useEffect, useCallback } from "react";

export const theme = createTheme({
  typography: {
    fontFamily: "Merriweather, sans-serif",
  },
});

export const App = () => {
  const dispatch = useDispatch();
  const authToken = useSelector(selectCurrentToken);

  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.get("/auth/refresh", {
        withCredentials: true,
      });
      // If a new access token is received, update the Redux store
      if (response.data.accessToken) {
        dispatch(setCredentials({ token: response.data.accessToken }));
      }
    } catch (error) {
      // If the request fails, log out the user
      console.error("Error refreshing token:", error);
      dispatch(clearUser());
    }
  }, [dispatch]);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await refreshToken();
      } catch (error) {
        // If the request fails, log out the user
        console.error("Error verifying user:", error);
        dispatch(clearUser());
      }
    };

    // Check if authToken exists
    if (authToken) {
      verifyUser();

      // Set up an interval to check every 15 minutes (900000 milliseconds)
      const intervalId = setInterval(() => {
        verifyUser();
      }, 900000);

      // Clear the interval when the component is unmounted
      return () => clearInterval(intervalId);
    }
  }, [authToken, dispatch, refreshToken]);

  return (
    <ThemeProvider theme={theme}>
      <RoutesComponent />
    </ThemeProvider>
  );
};
