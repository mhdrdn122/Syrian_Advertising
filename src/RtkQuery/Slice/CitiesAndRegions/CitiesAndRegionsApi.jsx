import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../../Api/baseUrl";
import { prepareHeaders } from "../Global";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders,
});

export const CitiesAndRegionsSlice = createApi({
  reducerPath: "cities-and-regions",
  baseQuery,
  tagTypes: ["Cities", "Regions"],
  endpoints: (builder) => ({
    getCities: builder.query({
      query: () => "/cities",
      providesTags: ["Cities"],
    }),
    addNewCity: builder.mutation({
      query: (data) => ({
        url: "/cities",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cities"],
    }),
    updateCity: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/cities/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Cities"],
    }),
    deleteCity: builder.mutation({
      query: (id) => ({
        url: `/cities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cities"],
    }),

    getRegions: builder.query({
      query: () => "/regions",
      providesTags: ["Regions"],
    }),
    addNewRegion: builder.mutation({
      query: (data) => ({
        url: "/regions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Regions"],
    }),
    updateRegion: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/regions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Regions"],
    }),
    deleteRegion: builder.mutation({
      query: (id) => ({
        url: `/regions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Regions"],
    }),
    getActiveRegionsByCity: builder.mutation({
      query: (id) => ({
        url: `/get-active-regions-by-city?city_id=${id}`,
        method: "GET",
      }),
      invalidatesTags: ["Regions"],
    }),
  }),
});

export const {
  useGetCitiesQuery,
  useAddNewCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
  useGetRegionsQuery,
  useAddNewRegionMutation,
  useUpdateRegionMutation,
  useDeleteRegionMutation,
  useGetActiveRegionsByCityMutation,
} = CitiesAndRegionsSlice;
