import AxiosInterceptor from './axios-interceptor';

const registorUser = (dataToPost) => {
    return AxiosInterceptor.post(
      "/api/user/create",
      {
        ...dataToPost,
      },
      {
        withCredentials: false,
      }
    );
};

const listOfUser = (page = 0, limit = 5, filter) => {
  return AxiosInterceptor.get("/api/user/list",{ params: {
    page,
    limit,
    ...filter
  }},{ withCredentials: true });
};


const updateUserRegistrationDate = (id, dataToUpdate) => {
    return AxiosInterceptor.patch(
      `/api/user/update/${id}`,
      {
        ...dataToUpdate,
      },
      {
        withCredentials: true,
      }
    );
};

const adminLogin = (credentials = {}) => {
  return AxiosInterceptor.post("/api/user/admin/login", credentials, {
    withCredentials: true,
  });
}

const adminLogout = (credentials = {}) => {
  return AxiosInterceptor.post("/api/user/admin/logout", credentials, {
    withCredentials: true,
  });
}

export { registorUser, listOfUser, updateUserRegistrationDate, adminLogin, adminLogout };
