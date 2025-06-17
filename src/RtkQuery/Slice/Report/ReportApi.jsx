import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "../Global.jsx";


 
  export const ReportSlice = createApi({
    reducerPath: "report",
    baseQuery:baseQueryWithReauth,
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