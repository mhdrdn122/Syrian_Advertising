import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "../Global.jsx";

export const ReportSlice = createApi({
  reducerPath: "report",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["report"],
  endpoints: (builder) => ({
    getSoadSignDontHaveBooking: builder.query({
      query: () => "/get-road-sign-dont-have-booking",
    }),
    getRoadSignBookingByWeek: builder.query({
      query: () => "/get-roadSigns-bookings-by-customer-with-templates-mode",
    }),
    getRoadSignBookingByDate: builder.query({
      query: (from_date, to_date) => {
        const params = new URLSearchParams();
        if (from_date) params.append("from_date", from_date);
        if (to_date) params.append("to_date", to_date);

        const queryParams = params.toString();

        return `/get-roadSigns-bookings-by-customer-with-templates-model${
          queryParams ? "?" + queryParams : ""
        }`;
      },
    }),
  }),
});

export const {
  useGetRoadSignBookingByWeekQuery,
  useGetSoadSignDontHaveBookingQuery,
  useGetRoadSignBookingByDateQuery
} = ReportSlice;
