// UserActionsDialog.jsx (Dumb Component)
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const DialogBox = ({
  open,
  handleClose,
  label,
  fields = [],
  actions = [],
  onFieldChange = () => {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            position: "relative",
            padding: "16px 24px",
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#fafafa",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: "#2b2c30",
              fontWeight: 600,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            {label}
          </Typography>

          <IconButton
            aria-label="Close"
            onClick={handleClose}
            title="Close"
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              backgroundColor: "#f4f4f4",
              borderRadius: "50%",
              padding: "6px",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {fields?.map(({ label, value, editable, type, name }, index) => (
            <Box sx={{ mb: 2 }} key={index}>
              <Typography variant="body10" sx={{ color: "black", mb: 1 }}>
                {label}
              </Typography>
              {type === "date" ? (
                <DatePicker
                  value={value ? dayjs(value) : null}
                  format="DD/MM/YYYY"
                  onChange={(newDate) => onFieldChange(name, newDate)}
                  disabled={!editable}
                  minDate={dayjs()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      size: "small",
                    },
                    popper: {
                      placement: "bottom-end",
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, 4],
                          },
                        },
                      ],
                    },
                  }}
                />
              ) : (
                <TextField
                  fullWidth
                  size="small"
                  value={value || "N/A"}
                  disabled={!editable}
                  onChange={(e) => onFieldChange(name, e.target.value)}
                />
              )}
            </Box>
          ))}
        </DialogContent>
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          gap={isMobile ? 1 : 2}
          justifyContent="flex-end"
          mt={2}
          mb={1}
          ml={isMobile ? 2.5: 0}
          mr={isMobile ? 2.5: 3.5}
        >
          {actions.map(
            (
              { label, onClick, color = "primary", variant = "contained" },
              idx
            ) => (
              <Button
                key={idx}
                onClick={onClick}
                color={color}
                variant={variant}
                fullWidth={isMobile}
              >
                {label}
              </Button>
            )
          )}
        </Box>
      </Dialog>
    </LocalizationProvider>
  );
};

export default DialogBox;
