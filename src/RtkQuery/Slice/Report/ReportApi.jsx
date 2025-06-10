import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {prepareHeaders}  from '../Global.jsx'
import { BASE_URL } from "../../../Api/baseUrl.jsx";


  const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders,
  });
  export const ReportSlice = createApi({
    reducerPath: "report",
    baseQuery,
    tagTypes: ["report"],
    endpoints: (builder) => ({
        getSoadSignDontHaveBooking : builder.query({
            query: () =>  "/get-road-sign-dont-have-booking" ,

      }),
       getRoadSignBookingByWeek : builder.query({
            query: () =>  "/get-road-signs-booking-by-week" ,
      }),
  
    })
})

export const {
    useGetRoadSignBookingByWeekQuery,
    useGetSoadSignDontHaveBookingQuery
}=ReportSlice;