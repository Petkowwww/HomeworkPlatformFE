import { baseApi } from "./baseApi";

export const gradeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGradeByHomeworkSubmissionId: builder.query({
      query: ({ token, submissionId }) => ({
        url: `/grade/${submissionId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Grade"],
    }),
    createGrade: builder.mutation({
      query: ({ token, body }) => ({
        url: `/grade`,
        method: "POST",
        body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Grade", "HomeworkSubmission"],
    }),
  }),
});

export const {
  useGetGradeByHomeworkSubmissionIdQuery,
  useCreateGradeMutation,
} = gradeApi;
