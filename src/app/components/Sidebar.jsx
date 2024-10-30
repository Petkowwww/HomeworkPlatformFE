import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import { School, Logout } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/slices/authSlice";

const drawerWidth = 240;

const menuItems = [{ text: "Classes", icon: <School />, path: "/classes" }];

function Sidebar() {
  // General hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Handlers
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#3f0e40",
          color: "white",
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Homework Platform
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              color: "white",
              "&.Mui-selected": {
                backgroundColor: "#5e3a7f",
              },
              "&:hover": {
                backgroundColor: "#5e3a7f",
              },
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} /> {/* Spacer to push logout to the bottom */}
      <List>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "#5e3a7f",
            },
            cursor: "pointer",
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Sidebar;
