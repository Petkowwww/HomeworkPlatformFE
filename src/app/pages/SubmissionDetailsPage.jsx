import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectRole, selectToken } from "../../features/slices/authSlice";
import { useGetHomeworkByIdQuery } from "../../features/api/homeworkApi";
import {
  useGetAllAttachmentsByHomeworkIdQuery,
  useGetAllAttachmentsByHomeworkSubmissionIdQuery,
} from "../../features/api/attachmentApi";
import dayjs from "dayjs";
import { useGetHomeworkSubmissionByIdQuery } from "../../features/api/homeworkSubmissionApi";
import { HOMEWORK_SUBMISSION_STATUS, TEACHER_ROLE } from "../../Constants";
import { useCreateGradeMutation } from "../../features/api/gradeApi";

const SubmissionDetailsPage = () => {
  // General hooks
  const { homeworkId, submissionId } = useParams();
  const navigate = useNavigate();

  // Selectors
  const token = useSelector(selectToken);
  const role = useSelector(selectRole);

  // State
  const [grade, setGrade] = useState(0);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Queries
  const { data: homework } = useGetHomeworkByIdQuery({ token, homeworkId });

  const { data: attachments } = useGetAllAttachmentsByHomeworkIdQuery({
    token,
    homeworkId,
  });

  const { data: homeworkSubmission } = useGetHomeworkSubmissionByIdQuery({
    token,
    submissionId,
  });

  const { data: attachmentsSubmission } =
    useGetAllAttachmentsByHomeworkSubmissionIdQuery({
      token,
      submissionId,
    });

  // Mutations
  const [createGrade] = useCreateGradeMutation();

  // Handlers
  const handleGradeChange = (event) => {
    setGrade(event.target.value);
  };

  const handleGradeSubmit = async () => {
    try {
      const body = {
        points: grade,
        homeworkSubmissionId: submissionId,
      };

      await createGrade({ token, body, submissionId }).unwrap();

      setSnackbarOpen(true);
      setIsGradeModalOpen(false);
      setGrade(0);

      navigate(-1);
    } catch (error) {
      alert("Failed to submit grade");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const openGradeModal = () => {
    setIsGradeModalOpen(true);
  };

  const closeGradeModal = () => {
    setIsGradeModalOpen(false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 700, mx: "auto" }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" mb={3}>
          Homework and Submission Details
        </Typography>

        <Typography variant="h6">Homework Details</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Title:</strong> {homework?.title}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Points:</strong> {homework?.points}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>Due Date:</strong>{" "}
          {dayjs(homework?.endDate).format("YYYY-MM-DD HH:mm")}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6">Homework Attachments</Typography>
        <List>
          {attachments?.map((file) => (
            <ListItem key={file.id}>
              <ListItemText primary={file.id} />
              <Button
                variant="contained"
                color="primary"
                onClick={() => window.open(file.attachmentUri, "_blank")}
              >
                Download
              </Button>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6">Submission Details</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Student:</strong> {homeworkSubmission?.studentFullName}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Submission Date:</strong>{" "}
          {dayjs(homeworkSubmission?.createdAt).format("YYYY-MM-DD HH:mm")}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6">Submission Attachments</Typography>
        <List>
          {attachmentsSubmission?.map((file) => (
            <ListItem key={file.id}>
              <ListItemText primary={file.id} />
              <Button
                variant="contained"
                color="primary"
                onClick={() => window.open(file.attachmentUri, "_blank")}
              >
                Download
              </Button>
            </ListItem>
          ))}
        </List>

        {/* Display grading or submission status */}
        {role === TEACHER_ROLE &&
          homeworkSubmission?.status === HOMEWORK_SUBMISSION_STATUS.GRADED && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2, mb: 1 }}
            >
              <strong>Status:</strong> Graded. You have already assigned a grade
              to this submission.
            </Typography>
          )}

        {role === TEACHER_ROLE &&
          homeworkSubmission?.status !== HOMEWORK_SUBMISSION_STATUS.GRADED && (
            <>
              <Divider sx={{ my: 3 }} />
              <Button
                sx={{ mt: 2, mr: 2 }}
                variant="contained"
                color="primary"
                onClick={openGradeModal}
              >
                Give Grade
              </Button>
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
            Grade submitted successfully!
          </Alert>
        </Snackbar>

        {/* Grade Modal */}
        <Dialog open={isGradeModalOpen} onClose={closeGradeModal}>
          <DialogTitle>Assign Grade</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Grade"
              type="number"
              fullWidth
              variant="outlined"
              value={grade}
              onChange={handleGradeChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeGradeModal} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleGradeSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default SubmissionDetailsPage;
