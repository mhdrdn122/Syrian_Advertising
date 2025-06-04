import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareHeaders } from "../Global";
import { BASE_URL } from "../../../Api/baseUrl";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders,
});

export const TemplateSlice = createApi({
  reducerPath: "TemplateSlice",
  baseQuery,
  tagTypes: ["Templates"],
  endpoints: (builder) => ({
    getTemplatesModel: builder.query({
      query: () => "/get-templates-model",
      providesTags: ["Templates"],
    }),
    getTemplates: builder.query({
      query: (id) => `/templates?model=${id}`,
      providesTags: (result, error, id) => [{ type: "Templates", id }],
    }),
    getTemplatesById: builder.mutation({
      query: (id) => ({
        url: `/templates/${id}`,
        method: "GET",
      }),
    }),
    createTemplate: builder.mutation({
      query: (data) => ({
        url: "/templates",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Templates"],
    }),
    deleteTemplate: builder.mutation({
      query: (id) => ({
        url: `/templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Templates"],
    }),
    UpdataTemplate: builder.mutation({
      query: ({ id, data }) => ({
        url: `/templates/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Templates"],
    }),
  }),
});

export const {
  useGetTemplatesModelQuery,
  useGetTemplatesQuery,
  useCreateTemplateMutation,
  useDeleteTemplateMutation,
  useGetTemplatesByIdMutation,
  useUpdataTemplateMutation,
} = TemplateSlice;