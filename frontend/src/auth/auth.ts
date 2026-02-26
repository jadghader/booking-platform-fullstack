import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "./authSlice";
import { RootState } from "../store/store";
import { API_BASE_URL } from "../config/env";
export interface User {
  [x: string]: any;
  emailValidate: boolean;
  role: string | null;
  userName: string | null;
}

export interface UserResponse {
  accessToken: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<UserResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    refresh: builder.mutation<{ accessToken: string }, void>({
      query: () => "/auth/refresh",
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          const { accessToken } = data;
          dispatch(setCredentials({ token: accessToken }));
        } catch (err) {
          console.log(err);
        }
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(setCredentials({ token: "" }));
        } catch (err) {
          console.log(err);
        }
      },
    }),
    getServices: builder.mutation<any, void>({
      query: () => ({
        url: "/service/services",
        method: "GET",
      }),
    }),
    deleteService: builder.mutation<any, any>({
      query: (id) => ({
        url: `/service/delete/${id}`,
        method: "DELETE",
      }),
    }),
    getService: builder.mutation<any, any>({
      query: (id) => ({
        url: `/service/services/${id}`,
        method: "GET",
      }),
    }),
    addService: builder.mutation<any, any>({
      query: (newJob) => ({
        url: "/service/create",
        method: "POST",
        body: newJob,
      }),
    }),
    editService: builder.mutation<any, any>({
      query: ({ id, newJob }) => ({
        url: `/service/edit/${id}`,
        method: "PUT",
        body: newJob,
      }),
    }),

    getUsers: builder.mutation<any, void>({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
    }),
    deleteUser: builder.mutation<any, any>({
      query: (id) => ({
        url: `/user/delete/${id}`,
        method: "DELETE",
      }),
    }),
    getUser: builder.mutation<any, any>({
      query: (id) => ({
        url: `/user/profile/${id}`,
        method: "GET",
      }),
    }),
    addUser: builder.mutation<any, any>({
      query: (newCandidate) => ({
        url: "/user/create",
        method: "POST",
        body: newCandidate,
      }),
    }),
    editUser: builder.mutation<any, any>({
      query: ({ id, newCandidate }) => ({
        url: `/user/edit/${id}`,
        method: "PUT",
        body: newCandidate,
      }),
    }),
    getBooking: builder.mutation<any, void>({
      query: () => ({
        url: "/booking/get",
        method: "GET",
      }),
    }),
    deleteApplication: builder.mutation<any, any>({
      query: (id) => ({
        url: `/booking/delete/${id}`,
        method: "DELETE",
      }),
    }),
    getApplication: builder.mutation<any, any>({
      query: (id) => ({
        url: `/booking/get/${id}`,
        method: "GET",
      }),
    }),
    addApplication: builder.mutation<any, any>({
      query: (newApplication) => ({
        url: "/booking/create",
        method: "POST",
        body: newApplication,
      }),
    }),
    editApplication: builder.mutation<any, any>({
      query: ({ id, newApplication }) => ({
        url: `/booking/edit/${id}`,
        method: "PATCH",
        body: newApplication,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGetServicesMutation, // Corrected mutation name
  useDeleteServiceMutation, // Corrected mutation name
  useAddServiceMutation,
  useEditServiceMutation, // Corrected mutation name
  useGetServiceMutation, // Corrected mutation name
  useAddUserMutation,
  useDeleteUserMutation,
  useGetUserMutation,
  useEditUserMutation,
  useGetBookingMutation, // Corrected mutation name
  useDeleteApplicationMutation,
  useGetApplicationMutation,
  useAddApplicationMutation,
  useEditApplicationMutation,
} = api;
