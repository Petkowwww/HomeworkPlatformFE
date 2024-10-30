import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./app/pages/LoginPage";
import ProtectedRoute from "./app/components/common/ProtectedRoute";
import ClassesPage from "./app/pages/ClassesPage";
import HomeworksPage from "./app/pages/HomeworksPage";
import SubmissionsPage from "./app/pages/SubmissionsPage";
import GradesPage from "./app/pages/GradesPage";
import Sidebar from "./app/components/Sidebar";
import CreateHomeworkPage from "./app/pages/CreateHomeworkPage";
import { useDispatch, useSelector } from "react-redux";
import {
  selectToken,
  selectUserId,
  setUser,
} from "./features/slices/authSlice";
import { useEffect } from "react";
import { useGetUserByIdQuery } from "./features/api/userApi";
import HomeworkDetailsPage from "./app/pages/HomeworkDetailsPage";
import SubmissionDetailsPage from "./app/pages/SubmissionDetailsPage";

function App() {
  // General hooks
  const dispatch = useDispatch();

  // Selectors
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);

  // Queries
  const { data: userData } = useGetUserByIdQuery(
    { token, id: userId },
    { skip: !token || !userId }
  );

  // Effects
  useEffect(() => {
    if (token && userId && userData) {
      dispatch(setUser(userData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId, userData]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div style={{ display: "flex" }}>
              <Sidebar />
              <main style={{ flexGrow: 1, padding: "20px", marginLeft: 40 }}>
                <Routes>
                  <Route path="classes" element={<ClassesPage />} />
                  <Route path="submissions" element={<SubmissionsPage />} />
                  <Route path="grades" element={<GradesPage />} />
                  <Route
                    path="/classes/:classId/homeworks"
                    element={<HomeworksPage />}
                  />
                  <Route
                    path="/classes/:classId/homework/create"
                    element={<CreateHomeworkPage />}
                  />
                  <Route
                    path="/classes/:classId/homework/:homeworkId"
                    element={<HomeworkDetailsPage />}
                  />
                  <Route
                    path="/classes/:classId/homework/:homeworkId/submission/:submissionId"
                    element={<SubmissionDetailsPage />}
                  />
                  <Route path="*" element={<Navigate to="classes" />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
