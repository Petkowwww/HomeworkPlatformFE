import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
  Grid,
  Tooltip,
  InputLabel,
  IconButton,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";
import {
  selectRole,
  selectToken,
  selectUserId,
} from "../../features/slices/authSlice";
import { useGetHomeworkByIdQuery } from "../../features/api/homeworkApi";
import dayjs from "dayjs";
import { useGetAllAttachmentsByHomeworkIdQuery } from "../../features/api/attachmentApi";
import {
  useCreateHomeworkSubmissionMutation,
  useGetAllHomeworkSubmissionsByClassIdQuery,
  useGetAllHomeworkSubmissionsByHomeworkIdQuery,
} from "../../features/api/homeworkSubmissionApi";
import { useState } from "react";
import {
  HOMEWORK_SUBMISSION_STATUS,
  STUDENT_ROLE,
  TEACHER_ROLE,
} from "../../Constants";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const HomeworkDetailsPage = () => {
  // General hooks
  const { classId, homeworkId } = useParams();
  const navigate = useNavigate();

  // Selectors
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  const role = useSelector(selectRole);

  // State
  const [files, setFiles] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Queries
  const { data: homework } = useGetHomeworkByIdQuery({ token, homeworkId });

  const { data: attachments } = useGetAllAttachmentsByHomeworkIdQuery({
    token,
    homeworkId,
  });

  const { data: homeworkSubmissionsByClass } =
    useGetAllHomeworkSubmissionsByClassIdQuery(
      {
        token,
        classId,
      },
      { skip: role !== STUDENT_ROLE }
    );

  const { data: homeworkSubmissionsByHomework } =
    useGetAllHomeworkSubmissionsByHomeworkIdQuery(
      {
        token,
        homeworkId,
      },
      { skip: role !== TEACHER_ROLE }
    );

  // Mutations
  const [createHomeworkSubmission, { isLoading }] =
    useCreateHomeworkSubmissionMutation();

  // Other variables
  const submissionStatus = homeworkSubmissionsByClass?.some(
    (hs) => hs.studentId === userId && hs.homeworkId === homeworkId
  );

  const homeworkSubmissionForCurrentStudent = homeworkSubmissionsByClass?.find(
    (hs) => hs.studentId === userId && hs.homeworkId === homeworkId
  );

  // Handlers
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setFiles(files);
  };

  const handleSubmit = async (event) => {
    try {
      const formData = new FormData();
      formData.append("homeworkId", homeworkId);

      // Append all selected files to formData
      files.forEach((file) => {
        formData.append("attachments", file);
      });

      await createHomeworkSubmission({ token, body: formData }).unwrap();

      setSnackbarOpen(true);
      setFiles([]); // Reset the file input

      navigate(`/classes/${classId}/homeworks`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSubmissionClick = (submissionId) => {
    // Navigate to the detailed view of the submission
    navigate(
      `/classes/${classId}/homework/${homeworkId}/submission/${submissionId}`
    );
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" mb={3}>
          Homework Details
        </Typography>
        <Typography variant="h6">{homework?.title}</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Instructions:</strong> {homework?.instructions}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Points:</strong> {homework?.points}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>Due Date:</strong>{" "}
          {dayjs(homework?.endDate).format("YYYY-MM-DD HH:mm")}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6" mb={1}>
          Attachments
        </Typography>
        <List>
          {attachments?.map((file, index) => (
            <ListItem key={index}>
              <ListItemText primary={file.id} />
              <Button
                variant="contained"
                color="primary"
                onClick={() => window.open(file.attachmentUri, "_blank")} // Change 'file.url' to the actual URL of the file
              >
                Download
              </Button>
            </ListItem>
          ))}
        </List>

        {role === TEACHER_ROLE && (
          <>
            <Typography variant="h6" mb={1}>
              Student Submissions
            </Typography>
            <Grid container>
              {homeworkSubmissionsByHomework?.map((submission) => (
                <Grid item xs={12} sm={6} md={4} key={submission.id}>
                  <Box
                    onClick={() => handleSubmissionClick(submission.id)}
                    sx={{
                      p: 2,
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      textAlign: "center",
                      cursor: "pointer",
                      "&:hover": {
                        boxShadow: 4,
                        backgroundColor: "#f0f0f0",
                      },
                    }}
                  >
                    <Typography variant="body1">
                      {submission.studentFullName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {dayjs(submission?.createdAt).format("YYYY-MM-DD HH:mm")}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 3 }} />
          </>
        )}

        {role === STUDENT_ROLE && (
          <>
            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" mb={1}>
              Submission
            </Typography>

            {homeworkSubmissionForCurrentStudent?.status ===
            HOMEWORK_SUBMISSION_STATUS.GRADED ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, mb: 1 }}
              >
                <strong>Grade:</strong>{" "}
                {homeworkSubmissionForCurrentStudent?.gradePoints}
              </Typography>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, mb: 1 }}
              >
                <strong>Status:</strong>{" "}
                {homeworkSubmissionForCurrentStudent?.status ===
                HOMEWORK_SUBMISSION_STATUS.SUBMITTED
                  ? HOMEWORK_SUBMISSION_STATUS.SUBMITTED
                  : HOMEWORK_SUBMISSION_STATUS.NOT_SUBMITTED}
              </Typography>
            )}

            {submissionStatus ? (
              <Typography variant="body1" color="green">
                You have already submitted this homework.
              </Typography>
            ) : (
              <>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <InputLabel htmlFor="file-upload">Attachments</InputLabel>
                  <input
                    accept="image/png, image/jpeg"
                    id="file-upload"
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload">
                    <Tooltip title="Upload Attachments">
                      <IconButton color="primary" component="span">
                        <AttachFileIcon />
                      </IconButton>
                    </Tooltip>
                  </label>
                </Stack>

                {files.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1">
                      Selected Attachments:
                    </Typography>
                    <Stack spacing={1}>
                      {files.map((file, index) => (
                        <Typography key={index} variant="body2">
                          {file.name}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                )}

                <Button
                  sx={{ mt: 2, mr: 2 }}
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
              </>
            )}
          </>
        )}

        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Back
        </Button>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            Submission successful!
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default HomeworkDetailsPage;
