import { baseApi } from "./baseApi";

export const homeworkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllHomeworksByClassId: builder.query({
      query: ({ token, classId }) => ({
        url: `/homework/by-class/${classId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Homework"],
    }),
    getHomeworkById: builder.query({
      query: ({ token, homeworkId }) => ({
        url: `/homework/${homeworkId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Homework"],
    }),
    createHomework: builder.mutation({
      query: ({ token, body }) => ({
        url: "/homework",
        method: "POST",
        body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Homework"],
    }),
  }),
});

export const {
  useGetAllHomeworksByClassIdQuery,
  useGetHomeworkByIdQuery,
  useCreateHomeworkMutation,
} = homeworkApi;
