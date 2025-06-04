import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../../Api/baseUrl";
import { prepareHeaders } from '../Global';

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders
});

export const AuthSlice = createApi({
    reducerPath: 'auth',
    baseQuery,
    tagTypes: ["profile"],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: '/login',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ["profile"]
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
            invalidatesTags: ["profile"]
        }),
        getProfile: builder.query({
            query: () => "/profile",
            providesTags: ["profile"]
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: '/update-profile',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ["profile"]
        }),
    }),
});

export const { 
    useLoginMutation, 
    useLogoutMutation, 
    useGetProfileQuery,
    useUpdateProfileMutation 
} = AuthSlice;