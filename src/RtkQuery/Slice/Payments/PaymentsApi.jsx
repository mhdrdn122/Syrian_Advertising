import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../Global";
import { BASE_URL } from "../../../Api/baseUrl";


export const PaymentsSlice = createApi({
  reducerPath: "payments",
  baseQuery:baseQueryWithReauth,
  tagTypes: ["payments"],
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: ({is_received}= {}) => {
        const params = new URLSearchParams()
        if(is_received==0) params.append("is_received",is_received)

        const queryString = params.toString();
        return `/payments${queryString ? `?${queryString}` : ""}`;
      },
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

     confirmOnePayment: builder.mutation({
      query: (id) => ({
        url: `/payment-is-Received/${id}`,
        method: "GET", 
      }),
      invalidatesTags: ["payments"],
    }),
    


  }),
});

export const { useGetPaymentsQuery, useAddNewPaymentMutation , useConfirmOnePaymentMutation} = PaymentsSlice;
