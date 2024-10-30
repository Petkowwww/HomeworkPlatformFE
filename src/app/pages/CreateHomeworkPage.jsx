// src/pages/CreateHomeworkPage.js
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  InputLabel,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useCreateHomeworkMutation } from "../../features/api/homeworkApi";
import { useSelector } from "react-redux";
import { selectToken } from "../../features/slices/authSlice";

const CreateHomeworkPage = () => {
  // General hooks
  const { classId } = useParams();
  const navigate = useNavigate();

  // Selectors
  const token = useSelector(selectToken);

  // State
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [points, setPoints] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [attachments, setAttachments] = useState([]);

  // Mutations
  const [createHomework, { isLoading }] = useCreateHomeworkMutation();

  // Handlers
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  const handleSubmit = async () => {
    try {
      // Handle form submission here
      const formData = new FormData();

      formData.append("title", title);
      formData.append("instructions", instructions);
      formData.append("points", points);
      formData.append("endDate", endDate);
      formData.append("classId", classId);

      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      await createHomework({ token, body: formData }).unwrap();

      navigate(`/classes/${classId}/homeworks`); // Redirect back to the homework page
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" mb={3}>
          Create New Homework
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Instructions"
            variant="outlined"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            multiline
            rows={4}
            fullWidth
          />

          <TextField
            label="Points"
            variant="outlined"
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            fullWidth
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Due Date"
              value={endDate}
              onChange={(newDate) => setEndDate(newDate)}
            />
          </LocalizationProvider>

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
          {attachments.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">Selected Attachments:</Typography>
              <Stack spacing={1}>
                {attachments.map((file, index) => (
                  <Typography key={index} variant="body2">
                    {file.name}
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Create Homework"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default CreateHomeworkPage;
