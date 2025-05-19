
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/MenuRounded";
import MenuCloseIcon from "@mui/icons-material/CancelRounded";
import HomeIcon from "@mui/icons-material/Home";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import { useNavigate } from "react-router-dom";
import "./navbar.css";
import { adminLogout } from "../../api/user";
import AccountMenu from "../Account-menu";

const AdminNavbar = () => {
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (side, open) => () => {
    if (side === "left") setLeftDrawerOpen(open);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setLeftDrawerOpen(false);
  };

  const handleLogout = () => {
    // Add logout logic
    adminLogout()
      .then(() => {
        localStorage.clear();
        navigate("/admin/login");
      })
      .catch((error) => {
        console.error(error);
      });
   
  };

  return (
    <>
      <AppBar position="static" className="custom-navbar-admin">
        <Toolbar className="navbar-toolbar" style={{ justifyContent: "space-between" }}>
          <IconButton onClick={toggleDrawer("left", true)}>
            <MenuIcon sx={{ color: "black", fontWeight: 900, fontSize: 35 }} />
          </IconButton>
          <AccountMenu onLogout={handleLogout} />
        </Toolbar>
      </AppBar>

      {/* Left Drawer */}
      <Drawer anchor="left" open={leftDrawerOpen} onClose={toggleDrawer("left", false)}>
        <List className="drawer-list">
          <Box
            sx={{
              p: 2,
              backgroundColor: "#DBBA2C",
              color: "white",
              mt: -1,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'black', alignContent: 'center' }}>
              Admin Panel
            </Typography>
            <IconButton onClick={toggleDrawer("left", false)}>
              <MenuCloseIcon sx={{ color: "white", fontSize: 30 }} />
            </IconButton>
          </Box>
          <Divider />
          <ListItem button onClick={() => handleNavigation("/admin/users")}>
            <ListItemIcon>
              <HomeIcon sx={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText primary="Booking List" />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => handleNavigation("/admin/date-config")}>
            <ListItemIcon>
              <BookOnlineIcon sx={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText primary="Booking Date Management" />
          </ListItem>
          <Divider />
        </List>
        <Box sx={{ mt: "auto", mr: 2, display: "flex", justifyContent: "center" }}>
          <img src={"/logo.png"} alt="Puzzle Panda" width={150} />
        </Box>
      </Drawer>
    </>
  );
};

export default AdminNavbar;
