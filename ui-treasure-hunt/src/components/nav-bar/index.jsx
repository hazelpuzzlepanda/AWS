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
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar position="static" className="custom-navbar">
        <Toolbar className="navbar-toolbar">
          <IconButton
            edge="start"
            className="menu-button"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon sx={{ color: "black", fontWeight: 900, fontSize: 35 }} />
          </IconButton>

          <Typography
            variant="h6"
            onClick={() => navigate("/book-now")}
            sx={{
              cursor: "pointer",
              fontWeight: 600,
              display: "inline-block",
              position: "relative",
              paddingBottom: "4px",
              "&::after": {
                content: '""',
                position: "absolute",
                width: "0%",
                height: "2px",
                bottom: 0,
                left: 0,
                backgroundColor: "white",
                transition: "width 0.3s ease",
              },
              "&:hover::after": {
                width: "100%",
              },
            }}
          >
            BOOK NOW
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
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
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Puzzle Panda
            </Typography>
            <IconButton
              edge="start"
              className="menu-button"
              onClick={toggleDrawer(false)}
            >
              <MenuCloseIcon
                sx={{
                  color: "white",
                  fontWeight: 900,
                  fontSize: 35,
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: "rotate(0deg)",
                  "&:hover": {
                    color: "#FEF3E2",
                    cursor: "pointer",
                    transform: "rotate(90deg)",
                    scale: "1.1",
                  },
                  "&:active": {
                    transform: "rotate(90deg) scale(0.95)",
                    transition: "transform 0.1s ease",
                  },
                }}
              />
            </IconButton>
          </Box>
          <Divider />
          <ListItem button onClick={() => handleNavigation("/")}>
            <ListItemIcon>
              <HomeIcon sx={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => handleNavigation("/book-now")}>
            <ListItemIcon>
              <BookOnlineIcon sx={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText primary="Book Now" />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => handleNavigation("/how-it-works")}>
            <ListItemIcon>
              <InfoIcon sx={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText primary="How It Works" />
          </ListItem>
          <Divider />
        </List>
        <Box
          sx={{ mt: "auto", mr: 2, display: "flex", justifyContent: "center" }}
        >
          <img src={"./logo.png"} alt="Puzzle Panda" width={150} />
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;



