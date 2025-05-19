// src/user/pages/Register.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  Stack,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PhoneIcon from "@mui/icons-material/Phone";
import { USER_CONSTANTS } from "../../constants/user";
import dayjs from "dayjs";
import { createStripeCheckoutSession } from "../../api/payment";

const Register = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [recipients, setRecipients] = useState(0);
  const [registrationDate, setRegistrationDate] = useState(dayjs());
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const checkoutSessionResponse = await createStripeCheckoutSession({
        mobileNumber,
        registrationDate,
        teamMemberCount: recipients,
      });
      console.log(checkoutSessionResponse, 'test');
      if (checkoutSessionResponse.status === 200) {
        const { data: { checkoutUrl } } = await checkoutSessionResponse;
        window.location.href = checkoutUrl;
      }

    } catch (error) {
      console.error(`::::::::ERROR::::::::${JSON.stringify(error)}`);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(to right, #4e54c8, #8f94fb)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 5,
          borderRadius: 4,
          minWidth: 350,
          maxWidth: 400,
          width: "90%",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
          {USER_CONSTANTS.REGISTOR_TOP_LABEL}
        </Typography>

        <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label={USER_CONSTANTS.MOB_NUMBER}
            variant="outlined"
            fullWidth
            required
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label={USER_CONSTANTS.RECIPIENTS}
            variant="outlined"
            fullWidth
            required
            type="number"
            sx={{ mb: 3 }}
            value={recipients}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val >= 0) setRecipients(val || 0);
            }}
            inputProps={{ min: 0 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PeopleIcon />
                </InputAdornment>
              ),
            }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Registration Date"
              minDate={dayjs()}
              format="DD/MM/YYYY"
              value={registrationDate}
              onChange={(newValue) => setRegistrationDate(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  variant="outlined"
                  sx={{ mb: 3 }}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: params.InputProps?.startAdornment || null,
                    endAdornment: params.InputProps?.endAdornment || null,
                  }}
                />
              )}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            size="large"
          >
            {USER_CONSTANTS.REGISTOR}
          </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default Register; 

