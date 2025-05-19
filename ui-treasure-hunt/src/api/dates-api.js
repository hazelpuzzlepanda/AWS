import axiosInstance from './axios-interceptor';

const updateLockedDates = (dataToPost) => {
    return axiosInstance.post("/api/date/lock-dates", dataToPost, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
};

const listOfLockedDates = (mobileNumber = '', filters) => {
    return axiosInstance.get(
      "/api/date/list",
      {
        params: {
          mobileNumber,
          ...filters
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
}

const deleteLockedDates = (data) => {
  return axiosInstance.patch(
    "/api/date/delete",
    {
      ...data,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

const publicListOfLockedDates = () => {
    return axiosInstance.get(
      "/api/date/public-list",
      {
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
}
export { updateLockedDates, listOfLockedDates, deleteLockedDates, publicListOfLockedDates };