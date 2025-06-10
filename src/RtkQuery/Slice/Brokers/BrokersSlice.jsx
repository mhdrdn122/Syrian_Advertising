import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../../Api/baseUrl";
import { prepareHeaders } from "../Global";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders,
});

export const BrokersSlice = createApi({
  reducerPath: "brokers",
  baseQuery,
  tagTypes: ["Brokers"],
  endpoints: (builder) => ({
    getBrokers: builder.query({
      query: () => "/brokers",
      providesTags: ["Brokers"],
    }),
    addNewBroker: builder.mutation({
      query: (data) => ({
        url: "brokers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Brokers"],
    }),
    deleteBroker: builder.mutation({
      query: (id) => {
        return({
        url: `brokers/${id}`,
        method: "POST",
        body:{"_method": "DELETE"}
      })},
      invalidatesTags: ["Brokers"],
    }),
    UpdataBroker: builder.mutation({
      query: ({ data, id }) =>{
        
        return ({
        url: `brokers/${id}`,
        method: "POST",
        body: {...data,"_method": "PUT"} 
      })},
      invalidatesTags: ["Brokers"],
    }),
  }),
});

export const {
  useGetBrokersQuery,
  useAddNewBrokerMutation,
  useDeleteBrokerMutation,
  useUpdataBrokerMutation,
} = BrokersSlice;
