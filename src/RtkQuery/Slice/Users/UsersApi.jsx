import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../../Api/baseUrl.jsx";
import { prepareHeaders } from "../Global.jsx";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders,
});

export const UsersSlice = createApi({
  reducerPath: "superAdminsApi",
  baseQuery,
  tagTypes: ["users"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["users"],
    }),
    getRoles: builder.query({
      query: () => "/roles",
    }),
    addNewUsers: builder.mutation({
      query: (data) => {
        return {
          url: "users",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["users"],
    }),
    // new new
    showOneUsers: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ["users"],
    }),
    getActivities: builder.query({
      query: (id) => `/get-activities-user-by-id?user_id=${id}`,
    }),
    deleteUser: builder.mutation({
      query: (id) => {
        return {
          url: `users/${id}`,
          method: "DELETE",
          body: {},
        };
      },
      invalidatesTags: ["users"],
    }),
    updateUsers: builder.mutation({
      query: (data) => {
        return {
          url: `users/${data.id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["users"],
    }),
  }),
});
export const {
  useGetUsersQuery,
  useGetRolesQuery,
  useAddNewUsersMutation,
  useShowOneUsersQuery,
  useUpdateUsersMutation,
  useDeleteUserMutation,
  useGetActivitiesQuery,
} = UsersSlice;
