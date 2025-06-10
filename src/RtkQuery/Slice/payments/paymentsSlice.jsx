import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareHeaders } from "../Global";
import { BASE_URL } from "../../../Api/baseUrl";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders,
});
export const paymentsSlice = createApi({
  reducerPath: "payments",
  baseQuery,
  tagTypes: ["payments"],
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: () => "payments",
      providesTags: ["payments"],
    }),
    addNewPayment: builder.mutation({
      query: (data) => {
        return {
          url: "payments",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["payments"],
    }),
  }),
});

export const { useGetPaymentsQuery, useAddNewPaymentMutation } = paymentsSlice;
