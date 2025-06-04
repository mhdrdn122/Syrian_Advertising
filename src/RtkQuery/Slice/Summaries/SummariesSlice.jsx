import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../../Api/baseUrl";
import { prepareHeaders } from '../Global'

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders
});

export const SummariesSlice = createApi({
    reducerPath: 'summaries',
    baseQuery,
    tagTypes: ["summaries"],
    endpoints: (builder) => ({
        getSummaries: builder.query({
            query: () => "/summaries"
        }),
       
    })
});

export const { useGetSummariesQuery  } = SummariesSlice;