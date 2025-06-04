import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Pagination,
  Chip,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Dialog,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { listOfUser, updateUserRegistrationDate } from "../../api/user";
import Loader from "../../components/loader";
import { useToast } from "../../components/toaster";
import { publicListOfLockedDates } from "../../api/dates-api";
import ParticipantAddForm from "./participant-add-form";
import {Person2Outlined} from '@mui/icons-material'

const AdminUserTable = () => {
  const [users, setUsers] = useState([]);
  const [loader, setLoader] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [userAdded,setUserAdded] = useState(false)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedDate, setSelectedDate] = useState(null);
  const [userDates, setUserDates] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempDate, setTempDate] = useState({});
  const [userId, setUserId] = useState(null);
  const [disableDates, setDisableDates] = useState([]);
  const [isParticipantFormOpen,setIsParticipantFormOpen] = useState(false)

    const [quizStatusFilter, setQuizStatusFilter] = useState("");
  const { showToast } = useToast();
  const fetchUsers = (pageNo) => {

    setLoader(true);
    const pageNumber = pageNo ? pageNo : page;
    if(userAdded)
    {
      setQuizStatusFilter('')
    }
    listOfUser(pageNumber, rowsPerPage,quizStatusFilter)
      .then((response) => {
        const { users = [], total = 0 } = response.data;
        setUsers(users);
        setTotalCount(total);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false);
        setUserAdded(false)
      });
  };
  useEffect(() => {
    fetchUsers();
  }, [page,userAdded,quizStatusFilter]);

  useEffect(() => {
      setLoader(true);
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
          setLoader(false);
        });
    }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleRegistrationFilter = (val) => {
    const registrationDate = val ? dayjs(val).format("YYYY-MM-DD") : undefined;
    listOfUser(page, rowsPerPage, { registrationDate })
      .then((resp) => {
        const { users = [], total = 0 } = resp.data;
        setUsers(users);
        setTotalCount(total);
        setSelectedDate(val);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const handleUserDateValues = (newDate, previousRegistrationDate, userId) => {
     if (newDate && newDate?.isBefore?.(dayjs()?.startOf?.('day'))) {
      showToast('Cannot select past dates', 'error');
      return;
    }
    const formattedNewDate = dayjs(newDate).format("YYYY-MM-DD");
    const oldDate = dayjs(previousRegistrationDate).format("YYYY-MM-DD");
    if (formattedNewDate === oldDate) return;
    setTempDate(formattedNewDate);
    setUserId(userId);
    setIsDialogOpen(true);
  };
  const handleCancelChange = () => {
    setTempDate(null);
    setUserId(null);
    setIsDialogOpen(false);
  };
  const handleConfirmChange = () => {
    setUserDates({ ...userDates, [userId]: tempDate });
    setLoader(true);
    updateUserRegistrationDate(userId, {
      registrationDate: tempDate
    }).then((response) => {
      setTempDate(null);
      setUserId(null);
      const { data = {}} = response;
      showToast(data?.message, 'success');
    }).catch(()=>{
      showToast('Some thing went wrong', 'error');
    }).finally(() => {
      setIsDialogOpen(false);
      setLoader(false);
    });
  };

  const isDisabled = (date) => {
    return disableDates.includes(date.format("YYYY-MM-DD"));
  };

  const handleClear = () => {
    fetchUsers(1);
    page !== 1 && setPage(1);
    setSelectedDate(null);
  }

  return loader ? (
    <Loader variant="overlay" />
  ) : (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          padding: isMobile ? 1.5 : 6,
          width: "auto",
          minHeight: "calc(100vh - 100px)",
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 3, fontWeight: "bold", textTransform: "uppercase" }}
        >
          Booking list
        </Typography>

        <Box
          sx={{
            overflowX: "auto",
            width: "100%",
            display: "block",
            borderRadius: "7px",
            p: 1,
          }}
        >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
            flexWrap: "wrap",
          }}
        >
            <DatePicker
              label="Filter by Registration Date"
              value={selectedDate}
              onChange={(newValue) => handleRegistrationFilter(newValue)}
              format="DD/MM/YYYY"
              sx={{ width: { xs: "100%", sm: "auto" }, ml: { sm: 2 } }}
              slotProps={{ textField: { size: "small" } }}
            />

            <Button
              variant="outlined"
              size="small"
              onClick={handleClear}
              disabled={!selectedDate}
              sx={{
                pt: 0.9,
                pb: 0.9,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Clear
            </Button>

            <FormControl size="small" sx={{ minWidth: 180, width: { xs: "100%", sm: "auto" } }}>
              <InputLabel id="quiz-status-label">Quiz Status</InputLabel>
              <Select
                labelId="quiz-status-label"
                label="Quiz Status"
                value={quizStatusFilter}
                onChange={(e) => {
                  setQuizStatusFilter(e.target.value);
                  fetchUsers(1);
                  setPage(1);
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={() => setIsParticipantFormOpen(true)}
              fullWidth={isMobile}
              sx={{
                textTransform: "none",
                ml: { sm: "auto" },
                mr: { xs: 0, sm: 2 },
                px: 3,
                py: 1,
                borderRadius: "8px",
                fontWeight: 600,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease-in-out",
                background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
                color: "#fff",
              }}
              startIcon={!isMobile && <Person2Outlined />}
            >
              Add Participant
            </Button>

            <ParticipantAddForm
              setIsParticipantFormOpen={setIsParticipantFormOpen}
              isParticipantFormOpen={isParticipantFormOpen}
              setUserAdded={setUserAdded}
            />
          </Box>
          <TableContainer
            component={Paper}
            elevation={3}
            sx={{
              padding: 2,
              boxShadow: "none",
              minWidth: 700,
            }}
          >
            <Table sx={{ minWidth: 700, border: "1px solid #e0e0e0" }}>
              <TableHead>
                <TableRow sx={{ borderBottom: "1px solid #ccc" }}>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      textAlign: "center",
                      color: "#808080",
                      borderRight: "1px solid #f0f0f0",
                    }}
                  >
                    Full Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      textAlign: "center",
                      color: "#808080",
                      borderRight: "1px solid #f0f0f0",
                    }}
                  >
                    Mobile Number
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      textAlign: "center",
                      color: "#808080",
                      borderRight: "1px solid #f0f0f0",
                    }}
                  >
                    Payment Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      textAlign: "center",
                      color: "#808080",
                      borderRight: "1px solid #f0f0f0",
                    }}
                  >
                    Quiz Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      textAlign: "center",
                      color: "#808080",
                      borderRight: "1px solid #f0f0f0",
                    }}
                  >
                    Treasure Hunt Date
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      textAlign: "center",
                      color: "#808080",
                      borderRight: "1px solid #f0f0f0",
                    }}
                  >
                    Participants
                  </TableCell>
                </TableRow>
              </TableHead>
              {users && !!users.length ? (
                <TableBody>
                  {users?.map((user) => (
                    <TableRow
                      key={user._id}
                      hover
                      sx={{ borderBottom: "1px solid #f0f0f0" }}
                    >
                      <TableCell
                        sx={{
                          textAlign: "center",
                          borderRight: "1px solid #f0f0f0",
                        }}
                      >
                        {user?.fullName || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          borderRight: "1px solid #f0f0f0",
                        }}
                      >
                        {user?.mobileNumber}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          borderRight: "1px solid #f0f0f0",
                        }}
                      >
                        <Chip
                          label={user?.isPaymentSuccessful ? "Paid" : "Unpaid"}
                          color={
                            user?.isPaymentSuccessful ? "success" : "default"
                          }
                          size="small"
                          variant={
                            user?.isPaymentSuccessful ? "filled" : "outlined"
                          }
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          borderRight: "1px solid #f0f0f0",
                        }}
                      >
                        <Chip
                          label={user.hasVoucher ? "Completed" : "Pending"}
                          color={user.hasVoucher ? "success" : "warning"}
                          size="small"
                          variant={user?.hasVoucher ? "filled" : "outlined"}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          borderRight: "1px solid #f0f0f0",
                        }}
                      >
                        <DatePicker
                          value={
                            userDates[user?._id]
                              ? dayjs(userDates[user?._id])
                              : dayjs(user?.registrationDate)
                          }
                          onChange={(newDate) =>
                            handleUserDateValues(
                              newDate,
                              user?.registrationDate,
                              user?._id
                            )
                          }
                          format="DD/MM/YYYY"
                          minDate={dayjs()}
                          shouldDisableDate={isDisabled}
                          slotProps={{
                            textField: {
                              label: "Select Date",
                              size: "small",
                            },
                            borderColor: "#f0f0f0",
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          borderRight: "1px solid #f0f0f0",
                        }}
                      >
                        {user?.teamMemberCount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      No Data Found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </Table>
          </TableContainer>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
          }}
        >
          {users && !!users.length && (
            <Pagination
              count={Math.ceil(totalCount / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          )}
        </Box>
        <Box>
          <Dialog
            open={isDialogOpen}
            onClose={handleCancelChange}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
          >
            <DialogTitle id="confirm-dialog-title">
              Confirm Date Change
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="confirm-dialog-description">
                Are you sure you want to change the date to{" "}
                <strong>{dayjs(tempDate).format("DD MMM YYYY")}</strong>?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCancelChange}
                color="error"
                variant="outlined"
              >
                No
              </Button>
              <Button
                onClick={handleConfirmChange}
                variant="contained"
                autoFocus
              >
                Yes, Change
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default AdminUserTable;
