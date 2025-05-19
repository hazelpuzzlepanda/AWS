import React from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="right-pane">
        <div className="image-grid">
          <img src={"./home_image_1.png"} alt="1" className="blob-img" />
          <img src={"./home_image_2.png"} alt="2" className="blob-img" />

          <img src={"./home_image_3.png"} alt="3" className="blob-img " />
        </div>
      </div>
      <div className="left-pane">
        <div style={{ textAlign: "center" }}>
          <img src={"./logo.png"} alt="Puzzle Panda" className="logo" />
        </div>
        <p className="tagline">
          Brighton's <span className="italic">Cheekiest</span> treasure Hunt!
        </p>
        <p className="description">
          Solve fun and naughty clues, explore the city, and celebrate with your
          friends. Perfect for hens, stags, and other groups looking for a wild
          day out!
        </p>
        <div style={{ textAlign: "center" }}>
          <Button
            className={"pay-button"}
            color="black"
            sx={{ fontWeight: 700, width: 200 }}
            onClick={() => navigate("/book-now")}
          >
            {" "}
            BOOK NOW
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;