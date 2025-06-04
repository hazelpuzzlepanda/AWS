import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import dayjs from "dayjs";
import { createParticipant } from "../../api/user";
import { useToast } from "../../components/toaster";
import { parsePhoneNumberFromString, isValidPhoneNumber } from "libphonenumber-js";
import 'react-phone-number-input/style.css';

const ParticipantAddForm = ({
  isParticipantFormOpen,
  setIsParticipantFormOpen,
  setUserAdded,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    countryCode: "44",
    teamMemberCount: 1,
    registrationDate: dayjs(),
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";

    const fullPhone = `+${formData.countryCode}${formData.mobileNumber}`;
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!isValidPhoneNumber(fullPhone)) {
      newErrors.mobileNumber = "Invalid mobile number";
    }

    if (formData.teamMemberCount < 1)
      newErrors.teamMemberCount = "Must be at least 1 participant";

    if (
      !formData.registrationDate ||
      formData.registrationDate.isBefore(dayjs(), "day")
    ) {
      newErrors.registrationDate = "Date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, registrationDate: date }));
  };

  const handlePhoneChange = (value) => {
    if (!value) {
      setFormData((prev) => ({ ...prev, mobileNumber: "", countryCode: "" }));
      setErrors((prev) => ({ ...prev, mobileNumber: "Mobile number is required" }));
      return;
    }

    if (!isValidPhoneNumber(value)) {
      setErrors((prev) => ({ ...prev, mobileNumber: "Invalid mobile number" }));
    } else {
      const parsed = parsePhoneNumberFromString(value);
      if (parsed?.isValid()) {
        setFormData((prev) => ({
          ...prev,
          mobileNumber: parsed.nationalNumber,
          countryCode: parsed.countryCallingCode,
        }));
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.mobileNumber;
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      setError(null);
      const formattedNewDate = dayjs(formData.registrationDate).format("YYYY-MM-DD");
      const formatedData = {
        ...formData,
        registrationDate: new Date(formattedNewDate),
      }
      const response = await createParticipant(formatedData);

      if (response.data) {
        showToast(response.data.message, "success");
        setFormData({
          fullName: "",
          mobileNumber: "",
          countryCode: "44",
          teamMemberCount: 1,
          registrationDate: dayjs(),
        });
        setIsParticipantFormOpen(false);
        setUserAdded(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add participant");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCansel = ()=>{
    setFormData({
        fullName: "",
        mobileNumber: "",
        countryCode: "44",
        teamMemberCount: 1,
        registrationDate: dayjs(),
    })
    setIsParticipantFormOpen(false)

  }
  return (
    <Dialog
      open={isParticipantFormOpen}
      onClose={() => !isSubmitting && setIsParticipantFormOpen(false)}
      maxWidth="sm"
      fullWidth
      sx={{ borderRadius: 2 }}
    >
      <DialogTitle>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
            color: 'white',
            padding: 2,
            borderRadius: 2,
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          Add New Participant
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            name="fullName"
            variant="outlined"
            value={formData.fullName}
            onChange={handleChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
          />

          <Box sx={{ mt: 2 }}>
            <PhoneInput
              international
              defaultCountry="GB"
              placeholder="Enter mobile number"
              value={
                formData.mobileNumber
                  ? `+${formData.countryCode}${formData.mobileNumber}`
                  : ""
              }
              onChange={handlePhoneChange}
            />
            {errors.mobileNumber && (
              <Typography variant="caption" color="error">
                {errors.mobileNumber}
              </Typography>
            )}
          </Box>

          <DatePicker
            label="Registration Date"
            value={formData.registrationDate}
            onChange={handleDateChange}
            format="DD/MM/YYYY"
            minDate={dayjs()}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "normal",
                error: !!errors.registrationDate,
                helperText: errors.registrationDate,
              },
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Number of Participants"
            name="teamMemberCount"
            type="number"
            variant="outlined"
            value={formData.teamMemberCount}
            onChange={handleChange}
            inputProps={{ min: 1 }}
            error={!!errors.teamMemberCount}
            helperText={errors.teamMemberCount}
          />

          <DialogActions sx={{ px: 0, pb: 0 }}>
            <Button
              onClick={handleCansel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantAddForm;
