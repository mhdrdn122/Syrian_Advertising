import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareHeaders } from "../Global";
import { BASE_URL } from "../../../Api/baseUrl";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders,
});
export const BookingSlice = createApi({
  reducerPath: "booking",
  baseQuery,
  tagTypes: ["bookings"],
  endpoints: (builder) => ({
    getBooking: builder.query({
      query: () => "/bookings",
      providesTags: ["bookings"],
    }),
    addNewBooking: builder.mutation({
      query: (data) => {
        return {
          url: "bookings",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["bookings"],
    }),
    calculateReservation: builder.mutation({
      query: (data) => {
        
        return {
          url: "get-calculate-Amount",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["reservations"],
    }),
    getOneBookings: builder.query({
      query: (id) => `bookings/${id}`,
      providesTags: ["bookings"],

    }),

    updateBookings: builder.mutation({
      query: (data) => {
        return {
          url: `bookings/${data.id}`,
          method: "POST",
          body: { ...data, "_method": "PUT" },
        };
      },
      invalidatesTags: ["bookings"],
    }),
  }),
});

export const {
  useGetBookingQuery,
  useAddNewBookingMutation,
  useCalculateReservationMutation,
  useUpdateBookingsMutation,
  useGetOneBookingsQuery,
} = BookingSlice;
