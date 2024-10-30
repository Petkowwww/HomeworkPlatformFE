import { Grid, Box, Typography, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetAllClassesQuery } from "../../features/api/classApi";
import { useSelector } from "react-redux";
import { selectToken } from "../../features/slices/authSlice";

const ClassesPage = () => {
  // General hooks
  const navigate = useNavigate();

  // Selectors
  const token = useSelector(selectToken);

  // Queries
  const { data: classesData } = useGetAllClassesQuery({ token });

  // Handlers
  const handleClassClick = (classId) => {
    navigate(`/classes/${classId}/homeworks`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Classes
      </Typography>
      <Grid container spacing={3}>
        {classesData?.map((classItem) => (
          <Grid item xs={12} sm={6} md={4} key={classItem.id}>
            <Card
              onClick={() => handleClassClick(classItem.id)}
              sx={{
                backgroundColor: "#f3f2f1",
                "&:hover": { backgroundColor: "#e1e1e1" },
                boxShadow: 2,
                borderRadius: 2,
                height: 150,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <CardContent>
                <Typography variant="h6" color="primary">
                  {classItem.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ClassesPage;
