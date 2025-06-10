import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareHeaders } from '../Global.jsx'
import { BASE_URL } from "../../../Api/baseUrl.jsx";

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders,
});

export const OrdersSlice = createApi({
    reducerPath: "orders",
    baseQuery,
    tagTypes: ["orders"],
    endpoints: (builder) => ({
      getOrders: builder.query({
        query: (params) => {
          const queryParams = new URLSearchParams();
          console.log(queryParams)
          if (params?.type) {
            params.type.forEach((type, index) => {
              queryParams.append(`type[${index}]`, type);
            });
          }
          if (params?.city_id) {
            queryParams.append("city_id", params.city_id);
          }
          if (params?.region_id) {
            queryParams.append("region_id", params.region_id);
          }
          if (params?.action_date) {
            queryParams.append("action_date", params.action_date);
          }
          return `/orders?${queryParams.toString()}`;
        },
        providesTags: ["orders"],
      }),
      confirmOneOrder: builder.mutation({
        query: (data) => {
          return {
            url: `update-status-order/${data.id}`,
            method: "POST",
            body: data,
          };
        },
        invalidatesTags: ["orders"],
      }),
      updateOrder: builder.mutation({
        query: (data) => {
          return {
            url: `orders/${data.id}`,
            method: "PUT",
            body: data.data,
          };
        },
        invalidatesTags: ["orders"],
      }),
    }),
});

export const {
  useGetOrdersQuery,
  useUpdateOrderMutation,
  useConfirmOneOrderMutation,
} = OrdersSlice;