import { baseApi } from "./baseApi";

export const homeworkSubmissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllHomeworkSubmissionsByClassId: builder.query({
      query: ({ token, classId }) => ({
        url: `/homeworksubmission/by-class/${classId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["HomeworkSubmission"],
    }),
    getAllHomeworkSubmissionsByHomeworkId: builder.query({
      query: ({ token, homeworkId }) => ({
        url: `/homeworksubmission/by-homework/${homeworkId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["HomeworkSubmission"],
    }),
    getHomeworkSubmissionById: builder.query({
      query: ({ token, submissionId }) => ({
        url: `/homeworksubmission/${submissionId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["HomeworkSubmission"],
    }),
    createHomeworkSubmission: builder.mutation({
      query: ({ token, body }) => ({
        url: `/homeworksubmission`,
        method: "POST",
        body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["HomeworkSubmission"],
    }),
  }),
});

export const {
  useGetAllHomeworkSubmissionsByClassIdQuery,
  useGetAllHomeworkSubmissionsByHomeworkIdQuery,
  useGetHomeworkSubmissionByIdQuery,
  useCreateHomeworkSubmissionMutation,
} = homeworkSubmissionApi;
