import { baseApi } from "./baseApi";

export const classApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllClasses: builder.query({
      query: ({ token }) => ({
        url: "/class",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Class"],
    }),
    getClassById: builder.query({
      query: ({ token, classId }) => ({
        url: `/class/${classId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Class"],
    }),
  }),
});

export const { useGetAllClassesQuery, useGetClassByIdQuery } = classApi;
