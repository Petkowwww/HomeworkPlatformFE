import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../../../features/slices/authSlice";

const ProtectedRoute = ({ children }) => {
  // Selectors
  const token = useSelector(selectToken);

  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
