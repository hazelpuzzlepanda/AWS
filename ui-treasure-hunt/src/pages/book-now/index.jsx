/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import dayjs from "dayjs";
import "./book-now.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createStripeCheckoutSession } from "../../api/payment";
import { useToast } from "../../components/toaster";
import "react-phone-number-input/style.css";
import Loader from "../../components/loader";
import { publicListOfLockedDates } from "../../api/dates-api";

const BookingForm = () => {
  const [participants, setParticipants] = useState(2);
  const [registrationDate, setRegistrationDate] = useState(dayjs());
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [errors, setErrors] = useState({});
  const [loader, setLoader] = useState(false);
  const [disableDates, setDisableDates] = useState([]);
  const { showToast } = useToast();
  const [globalLoader, setGlobalLoader] = useState(false);
  useEffect(() => {
    setGlobalLoader(true);
    publicListOfLockedDates()
      .then((response) => {
        const { data = {} } = response;
        const { lockedDates = [] } = data;
        setDisableDates(lockedDates);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setGlobalLoader(false);
      });
  }, []);

  const isDisabled = (date) => {
    return disableDates.includes(date.format("YYYY-MM-DD"));
  };

  const pricePerPerson = 10;
  const total =
    typeof participants === "number" ? pricePerPerson * participants : "?";

  const handleError = (key, value) => {
    let message = "";
    // const fullNameRegex = /^[A-Za-z\s'-]{2,50}$/;
    if (!value || (typeof value === "string" && value?.trim() === "")) {
      const errorKeysName = {
        participants: "Number of participants",
        fullName: "Full Name",
        mobileNumber: "Mobile number",
      };
      message = `${errorKeysName[key]} is required.`;
    } else if (key === "mobileNumber" && !isValidPhoneNumber(value)) {
      message = "Enter a valid WhatsApp number.";
    } else if (key === "participants" && Number(value) <= 1) {
      message = "Minimum 2 participants are required";
    } else if (
      key === "fullName" &&
      (typeof value !== "string")
    ) {
      message = "Enter a valid name.";
    }
    setErrors((prev) => ({
      ...prev,
      [key]: message,
    }));
  };
  const isFormValid = () => {
    return (
      Number(participants) > 1 &&
      fullName?.trim() !== "" &&
      whatsapp?.trim() !== "" &&
      registrationDate &&
      Object.values(errors).every((val) => val === "")
    );
  };

  const handleOnClick = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const checkoutSessionResponse = await createStripeCheckoutSession({
        mobileNumber: whatsapp,
        registrationDate: registrationDate?.format('YYYY-MM-DD'),
        teamMemberCount: participants,
        amount: total,
        fullName,
      });
      if (checkoutSessionResponse.status === 200) {
        const {
          data: { checkoutUrl },
        } = await checkoutSessionResponse;
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      if (error.status === 409)
        showToast(
          error?.response?.data?.message,
          "error"
        );
    } finally {
      setLoader(false);
    }
  };
  return (
    globalLoader ? <Loader variant={'overlay'} /> :
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="booking-main">
        <Box className="card-main">
          <Box className="booking-wrapper">
            <Typography variant="h4" className="form-title">
              BOOK NOW
            </Typography>

            <div className="form-section-main">
              <div className="form-section">
                <Typography className="form-label">
                  Number of participants:
                </Typography>
                <TextField
                  type="number"
                  placeholder="Number of participants"
                  fullWidth
                  value={participants === null ? "" : participants}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (value === "") {
                      setParticipants(null);
                      return;
                    }
                    if (/^0\d+/.test(value)) return;
                    if (value.length > 10) return;
                    if (Number(value) <= 0) return;
                    setParticipants(Number(value));
                    handleError("participants", value);
                  }}
                  onBlur={(e) => handleError("participants", e.target.value)}
                  error={!!errors.participants}
                  helperText={errors.participants}
                  sx={{
                    "& .MuiFormHelperText-root": {
                      color: "error.main",
                      marginLeft: 0.5,
                      fontSize: "0.75rem",
                    },
                  }}
                />
              </div>

              <div className="form-section">
                <Typography className="form-label">
                  Date of adventure:
                </Typography>
                <DatePicker
                  value={registrationDate}
                  minDate={dayjs()}
                  format="DD/MM/YYYY"
                  shouldDisableDate={isDisabled}
                  onChange={(newValue) => setRegistrationDate(newValue)}
                  className="form-input"
                />
              </div>

              <div className="form-section">
                <Typography className="form-label">Full Name</Typography>
                <TextField
                  placeholder="Full name"
                  fullWidth
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    handleError("fullName", e.target.value);
                  }}
                  onBlur={(e) => handleError("fullName", e.target.value)}
                  error={!!errors["fullName"]}
                  helperText={errors["fullName"]}
                  sx={{
                    "& .MuiFormHelperText-root": {
                      color: "error.main",
                      marginLeft: 0.5,
                      fontSize: "0.75rem",
                    },
                  }}
                />
              </div>
              <Box className="form-section">
                <Typography className="form-label">Mobile Number</Typography>
                <PhoneInput
                  international
                  defaultCountry="GB"
                  placeholder="Enter phone number"
                  value={whatsapp}
                  onChange={(value) => {
                    setWhatsapp(value);
                    handleError("mobileNumber", value);
                  }}
                  onBlur={(e) => handleError("mobileNumber", e.target.value)}
                  className={`PhoneInput ${errors["mobileNumber"] ? "PhoneInput--error" : ""}`}
                />
                {errors["mobileNumber"] && (
                  <div
                    style={{
                      color: "#d32f2f",
                      fontSize: "0.75rem",
                      marginTop: "4px",
                    }}
                  >
                    {errors["mobileNumber"]}
                  </div>
                )}
              </Box>
            </div>
            <div className="form-section-price">
              <Typography
                className="form-label-price"
                variant="subtitle2"
                sx={{
                  color: "gray",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  marginRight: 2,
                }}
              >
                TOTAL PRICE:
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  color: "black",
                }}
              >
                <Typography
                  color="black"
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  }}
                >
                  £10 × {participants || "0"}
                </Typography>

                <Box component="span">=</Box>

                <Typography
                  variant="h6"
                  sx={{ fontSize: { xs: "14px", sm: "1rem" } }}
                >
                  £{total || "0"}
                </Typography>
              </Box>
            </div>
            <Box sx={{ display: "flex", width: "100%" }}>
              <Button
                className="pay-button"
                sx={{ width: "100%", color: "black", fontWeight: 700 }}
                disabled={!isFormValid()}
                onClick={handleOnClick}
              >
                {loader ? <Loader color={'#FFFFFF'} /> : 'PAY NOW'}
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              width: 400,
              height: 460,
              display: { lg: "flex", xs: "none" },
              justifyContent: "center",
            }}
          >
            <img src="/panda.png" width={350} height={"90%"} />
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default BookingForm;
