import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareHeaders } from "../Global.jsx";
import { BASE_URL } from "../../../Api/baseUrl";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders,
});

export const CustomersSlice = createApi({
  reducerPath: "customers",
  baseQuery,
  tagTypes: ["customers"],
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: () => "customers",
      providesTags: ["customers"],
    }),
    addNewCustomer: builder.mutation({
      query: (data) => ({
        url: "customers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["customers"],
    }),
    showOneCustomer: builder.query({
      query: (id) => `customers/${id}`,
      providesTags: ["customers"],
    }),
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["customers"],
    }),
    updateCustomer: builder.mutation({
      query: (data) => ({
        url: `customers/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["customers"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useAddNewCustomerMutation,
  useShowOneCustomerQuery,
  useDeleteCustomerMutation,
  useUpdateCustomerMutation,
} = CustomersSlice;
