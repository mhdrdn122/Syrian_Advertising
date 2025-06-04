import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareHeaders } from "../Global";
import { BASE_URL } from "../../../Api/baseUrl";


  const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders,
  });
  export const ContractsSlice = createApi({
    reducerPath: "contracts",
  baseQuery,
  tagTypes: ["contracts"],
  endpoints: (builder) => ({
    getContracts: builder.query({
        query: () => "/contracts",
        providesTags: ["contracts"],
    }),
      showOneContract: builder.query({
      query: (id) =>
        `contract-renewal/${id}`,
      providesTags: ["contracts"],
    }),
    addNewReservationContract: builder.mutation({
      query: (data) => {
        return {
          url: "contract-renewal",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["contracts"],
    }),
    updateDiscount: builder.mutation({
      query: (data) => {
        return {
          url: `discount-contract/${data.id}`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["contracts"],
    }),
    deleteContract:builder.mutation({
      query:(id)=>({
        url:`contracts/${id}`,
        method:"DELETE",
        body:{id}
      }),
    invalidatesTags : ["contracts"]
    }),


  }) 
})
export const {
    useGetContractsQuery,
    useShowOneContractQuery,
    useAddNewReservationContractMutation,
    useUpdateDiscountMutation,
    useDeleteContractMutation
} = ContractsSlice;
    