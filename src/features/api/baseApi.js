import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:5001/api/v1" }),
  tagTypes: ["Homework", "Class", "Attachment", "HomeworkSubmission", "Grade"],
  endpoints: () => ({}),
});
