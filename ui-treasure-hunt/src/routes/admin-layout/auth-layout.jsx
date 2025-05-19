import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  const token = localStorage.getItem("accessToken");
      if (token) {
        return <Navigate to="/admin/users" replace />;
      }
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            width: "100%",
            background: "linear-gradient(to right, #DBBA2C 50%, white 50%)",
          }}
        >
          <div style={{ width: "100%", maxWidth: "400px" }}>{children}</div>
        </div>
      );
};

export default AuthLayout;