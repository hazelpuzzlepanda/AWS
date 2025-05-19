import React from "react";
import "./about.css";
import { Box, Divider, Stack, Typography } from "@mui/material";

const About = () => {
  const stepsList = [
    "Pick your date and squad size",
    "Get your mission briefing via a WhatsApp message",
    "Reply 'START' to launch your adventure",
    "Crack cheeky clues and discover Brighton's spicy, sex-positive secrets",
    "Each participant receives a free adult gift from a legendary Brighton sex shop—plus a celebratory drink at a top Brighton bar!",
  ];
  return (
    <div className="about-container">
      <div className="about-cloud">
        <div className="right-text-wrapper">
          <h1>A</h1>
          <h1>B</h1>
          <h1>O</h1>
          <h1>U</h1>
          <h1>T</h1>
        </div>

        <img
          src="/about.png"
          alt="Adventure group"
          className="cloud-img-inside"
        />
      </div>
      <div className="about-text">
        <h2>How it works</h2>
        <Divider sx={{ mb: 2, mx: 2 }} />
        <Stack component="ol" spacing={2} sx={{ pl: 0, listStyle: "none" }}>
          {stepsList.map((step, index) => (
            <Box
              key={index}
              component="li"
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                // borderLeft: "10px solid #1976d2",
                pl: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: "primary.main",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {index + 1}
              </Typography>
              <Typography variant="body1" sx={{ flex: 1 }}>
                {step}
              </Typography>
            </Box>
          ))}
        </Stack>
      </div>
    </div>
  );
};

export default About;
