import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import DisabledDatePicker from "./DisabledDatePicker";
import {
  deleteLockedDates,
  listOfLockedDates,
  updateLockedDates,
} from "../../api/dates-api";
import { decodeToken } from "../../utils/decode-token";
import Modal from "../../components/pop-ups";
import { useToast } from "../../components/toaster";

const AdminDateConfig = () => {
  const [disabledDates, setDisabledDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [listLoader, setListLoader] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [deleteDate, setDeleteDate] = useState(null);
  const [page, setPage] = useState(1);
  const LIMIT = 5;
  const jwtDecode = decodeToken();
  const { showToast } = useToast();

  const fetchDates = async () => {
    setListLoader(true);
    try {
      const response = await listOfLockedDates(jwtDecode?.mobileNumber, {
        skip: (page - 1) * LIMIT,
        limit: LIMIT,
      });
      setDisabledDates(response?.data?.lockedDates || []);
      setTotalPages(response?.data?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching dates", err);
    } finally {
      setListLoader(false);
    }
  };

  useEffect(() => {
    fetchDates();
  }, [page]);

  const addDate = async () => {
    const formatted = dayjs(selectedDate).format("YYYY-MM-DD");
    if (selectedDate && !disabledDates.includes(formatted)) {
      try {
        await updateLockedDates({
          lockedDate: formatted,
          mobileNumber: jwtDecode?.mobileNumber,
        });
        setSelectedDate(null);
        showToast('Date added successfully');
        fetchDates();
      } catch (err) {
        console.error("Failed to add date", err);
      }
    }
  };

  const removeDate = async (dateToRemove) => {
    try {
      await deleteLockedDates({
        date: dateToRemove,
        mobileNumber: jwtDecode?.mobileNumber,
      });
      showToast('Date deleted successfully');
      page === 1 ? fetchDates() : setPage(1);
    } catch (err) {
      console.error("Failed to remove date", err);
    }
    setOpenModal(false);
    setDeleteDate(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          padding: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 600,
          }}
        >
          <LockIcon /> Booking Date Management
        </Typography>

        <Paper sx={{ p: 2, mb: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <DisabledDatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            onAdd={addDate}
          />
        </Paper>

        <Typography
          variant="subtitle1"
          sx={{
            mb: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 600,
            fontSize: "1.5rem",
          }}
        >
          <CalendarTodayIcon /> Locked Dates
        </Typography>

        {listLoader ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} elevation={1} sx={{ borderRadius: '5px'}}>
              <Table>
                <TableHead sx={{ backgroundColor: "#ccc" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "center" , borderRight: "1px solid #f0f0f0"}}>
                      #
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "center", borderRight: "1px solid #f0f0f0" }}>
                      LOCKED DATE
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "center", borderRight: "1px solid #f0f0f0" }}>
                      ACTION
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {disabledDates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No locked dates available
                      </TableCell>
                    </TableRow>
                  ) : (
                    disabledDates.map((date, index) => (
                      <TableRow key={date} hover>
                        <TableCell sx={{ textAlign: "center",  borderRight: "1px solid #f0f0f0" }}>
                          {(page - 1) * LIMIT + index + 1}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center",  borderRight: "1px solid #f0f0f0" }}>
                          {dayjs(date).format("DD MMM YYYY")}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", borderRight: "1px solid #f0f0f0" }}>
                          <IconButton
                            color="error"
                            onClick={() => {
                              setOpenModal(true);
                              setDeleteDate(date);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Modal
              open={openModal}
              onClose={() => setOpenModal(false)}
              onConfirm={() => removeDate(deleteDate)}
              title="Confirm Deletion"
              body="Are you sure you want to delete this item? This action cannot be undone."
              primaryButtonText="Delete"
              secondaryButtonText="Cancel"
            />

            {totalPages > 1 && (
              <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, val) => setPage(val)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default AdminDateConfig;


