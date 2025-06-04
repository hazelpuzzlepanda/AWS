import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Button, Box } from "@mui/material";
import dayjs from "dayjs";

const DisabledDatePicker = ({ value, onChange, onAdd }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        gap: 2,
        width: "100%",
        maxWidth: 400,
        mx: "auto",
        mt: 2,
      }}
    >
      <DatePicker
        value={value}
        onChange={onChange}
        format="DD/MM/YYYY"
        minDate={dayjs()}
        slotProps={{
          textField: {
            label: "Select Date",
            size: "small",
            fullWidth: true,
          },
        }}
      />
      <Button
        onClick={onAdd}
        variant="contained"
        disabled={!value}
        color="primary"
        size="medium"
        sx={{
          minWidth: 100,
          whiteSpace: "nowrap",
          textTransform: "none",
          fontWeight: "bold",
          fontSize: "0.875rem",
        }}
      >
        ADD
      </Button>
    </Box>
  );
};

export default DisabledDatePicker;

