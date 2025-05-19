import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import "./success.css";
import { verifySession } from "../../api/payment";
import { useToast } from "../../components/toaster";
import CancelIcon from '@mui/icons-material/Cancel';
const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(null); 
  const query = new URLSearchParams(location.search);
  const sessionId = query.get("session_id");
  const { showToast } = useToast();
  useEffect(() => {
    if (!sessionId) {
      navigate("/");
      return;
    }
    if (isValid === null) {
      verifySession(sessionId)
        .then((response) => {
          const { data = {} } = response;
          if (data?.valid) {
            setIsValid(true);
            showToast("Booking succesfully", "success");
          }
        })
        .catch(() => navigate("/"));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (isValid === null) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          flexDirection: "column",
        }}
      >
        <CircularProgress />
        <Typography mt={2}>Verifying payment...</Typography>
      </Box>
    );
  }
  // // eslint-disable-next-line eqeqeq
  if (isValid === false) {
    return (
      <Box className="success-main">
      <Box className="payment-container" sx={{ textAlign: "center" }}>
        <CancelIcon sx={{width:130,height:130,color:'red'}}/>
        <Typography mt={2} sx={{fontWeight:700,color:'red'}}>Payment failed. Please try again.</Typography>
      </Box>
      </Box>
    );
  }
  return (
    <Box className="success-main">
      <Box
        className="payment-container"
        gap={2}
        border={1}
        borderColor={"lightgray"}
      >
        <img src="/panda.png" alt="Success Panda" className="success-image" />
        <Typography variant="h6" className="success-message">
          Payment confirmed!
        </Typography>
        <Typography variant="body1" className="adventure-text">
         {`You’ve successfully registered. You’ll receive a confirmation message on WhatsApp either today or on your event day.`}
        </Typography>
        <Button
          color="black"
          className="pay-button"
          onClick={() => navigate("/")}
        >
          Back Home
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentSuccess;


