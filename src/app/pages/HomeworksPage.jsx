import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useGetAllHomeworksByClassIdQuery } from "../../features/api/homeworkApi";
import { useSelector } from "react-redux";
import { selectRole, selectToken } from "../../features/slices/authSlice";
import { useGetClassByIdQuery } from "../../features/api/classApi";
import dayjs from "dayjs";
import { TEACHER_ROLE } from "../../Constants";

const HomeworkPage = () => {
  // General hooks
  const navigate = useNavigate();
  const { classId } = useParams();

  // Selectors
  const token = useSelector(selectToken);
  const role = useSelector(selectRole);

  // Queries
  const { data: classData } = useGetClassByIdQuery({
    token,
    classId,
  });

  const { data: homeworks } = useGetAllHomeworksByClassIdQuery({
    token,
    classId,
  });

  // Handlers
  const handleAddHomeworkClick = () => {
    navigate(`/classes/${classId}/homework/create`);
  };

  const handleHomeworkClick = (homeworkId) => {
    navigate(`/classes/${classId}/homework/${homeworkId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">
          Homework for{" "}
          <span style={{ fontWeight: "bold" }}>{classData?.name}</span>
        </Typography>

        {role === TEACHER_ROLE && (
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleAddHomeworkClick}
          >
            <AddIcon />
          </Fab>
        )}
      </Box>
      <List sx={{ width: "100%", maxWidth: 600, bgcolor: "background.paper" }}>
        {homeworks?.map((homework) => (
          <ListItem
            onClick={() => handleHomeworkClick(homework.id)}
            key={homework.id}
            component={Paper}
            sx={{ my: 1, p: 2, display: "block", cursor: "pointer" }}
          >
            <ListItemText
              primary={
                <Typography variant="h6" color="primary">
                  {homework.title}
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="body2" color="textSecondary">
                    Points: {homework.points}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Due Date:{" "}
                    {dayjs(homework.endDate).format("YYYY-MM-DD HH:mm")}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default HomeworkPage;
