import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../../Api/baseUrl";
import { prepareHeaders } from "../Global";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders,
});

export const RoadSignsSlice = createApi({
  reducerPath: "roadSigns",
  baseQuery,
  tagTypes: ["RoadSigns"],
  endpoints: (builder) => ({
    getRoadSigns: builder.query({
      query: ({ start_date, end_date, city_id, region_id } = {}) => {
        const params = new URLSearchParams();
        if (start_date) params.append("start_date", start_date);
        if (end_date) params.append("end_date", end_date);
        if (city_id) params.append("city_id", city_id);
        if (region_id) params.append("region_id", region_id);
        const queryString = params.toString();
        return `/road-signs${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["RoadSigns"],
    }),
    getTemplateProducts: builder.query({
      query: () => "/get-template-products",
    }),
    deleteRoadSign: builder.mutation({
      query: (id) => ({
        url: `road-signs/${id}`,
        method: "POST",
        body: { _method: "DELETE" },
      }),
      invalidatesTags: ["RoadSigns"],
    }),
    getRoadSignById: builder.query({
      query: (id) => `road-signs/${id}`,
      providesTags: (result, error, id) => [{ type: "RoadSigns", id }],
    }),
    updateRoadSign: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `road-signs/${id}`,
        method: "POST",
        body: { ...data, _method: "PUT" },
      }),
      invalidatesTags: ["RoadSigns"],
    }),
    addRoadSign: builder.mutation({
      query: (data) => ({
        url: `road-signs`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["RoadSigns"],
    }),
  }),
});

export const {
  useGetRoadSignsQuery,
  useDeleteRoadSignMutation,
  useGetRoadSignByIdQuery,
  useUpdateRoadSignMutation,
  useAddRoadSignMutation,
  useGetTemplateProductsQuery,
} = RoadSignsSlice;
