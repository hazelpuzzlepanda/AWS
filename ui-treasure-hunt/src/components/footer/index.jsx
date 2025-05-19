/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

const MiroFooter = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#EEEEEE",
        color: "white",
        padding: { xs: "2rem 1rem", md: "3rem 0" },
        minHeight: "200px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent={"space-between"}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <EmailIcon sx={{ mr: 1, fontSize: "2rem", color: "black" }} />
              <Typography variant="h6" component="h2" color="black">
                Contact Us
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <a
                href="mailto:hazel@puzzelpanda.co"
                style={{ color: "black", textDecoration: "none" }}
              >
                hazel@puzzelpanda.co
              </a>
            </Typography>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              backgroundColor: "transparent",
            }}
          >
            <img
              src="/panda.png"
              width={150}
              height={150}
              style={{
                mixBlendMode: "multiply",
                background: "transparent",
                objectFit: "contain",
              }}
            />
          </Box>
        </Grid>

        <Box
          sx={{
            mt: 4,
            pt: 2,
            borderTop: "1px solid black",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="black">
            © {new Date().getFullYear()} Puzzle Panda. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default MiroFooter;

