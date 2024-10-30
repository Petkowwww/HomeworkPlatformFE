import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../features/api/authApi";
import { useState } from "react";
import { setCredentials } from "../../features/slices/authSlice";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: theme.palette.grey[200],
}));

const LoginBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: "400px",
}));

const LoginPage = () => {
  // General hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Mutations
  const [login, { isLoading, error }] = useLoginMutation();

  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials(userData));
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <StyledContainer>
      <LoginBox elevation={3}>
        <LockOutlinedIcon color="primary" fontSize="large" />
        <Typography variant="h5" component="h1" sx={{ mt: 2 }}>
          Sign In
        </Typography>
        <Box component="form" noValidate sx={{ mt: 2, width: "100%" }}>
          <TextField
            label="Email Address"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          {error && (
            <Alert severity="error">
              {error?.data?.message || "Failed to log in"}
            </Alert>
          )}
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLogin}
            sx={{ mt: 1, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Sign In"}
          </Button>
        </Box>
      </LoginBox>
    </StyledContainer>
  );
};

export default LoginPage;
