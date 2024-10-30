import { baseApi } from "./baseApi";

export const attachmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAttachmentsByHomeworkId: builder.query({
      query: ({ token, homeworkId }) => ({
        url: `/attachment/by-homework/${homeworkId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Attachment"],
    }),
    getAllAttachmentsByHomeworkSubmissionId: builder.query({
      query: ({ token, submissionId }) => ({
        url: `/attachment/by-homeworksubmission/${submissionId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Attachment"],
    }),
  }),
});

export const {
  useGetAllAttachmentsByHomeworkIdQuery,
  useGetAllAttachmentsByHomeworkSubmissionIdQuery,
} = attachmentApi;
