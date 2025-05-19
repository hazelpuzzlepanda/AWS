import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import SuccessPage from "./pages/success";
import BookingForm from "./pages/book-now";
import Home from "./pages/home";
import About from "./pages/about";
import AdminUserTable from "./pages/admin-user-table";
import AdminLogin from "./pages/admin-login";
import PublicLayout from "./routes/public-layout";
import PrivateLayout from "./routes/admin-layout/private-layout";
import AuthLayout from "./routes/admin-layout/auth-layout";
import { ToastProvider } from "./components/toaster";
import "./style.css";
import { useEffect } from "react";
import AdminDateConfig from "./pages/date-configuration";

const App = () => {
  const location = useLocation();
  useEffect(() => {
    const pageTitles = {
      "/": "",
      "/how-it-works": "How it works",
      "/book-now": "Book now",
      "/success": "success",
    };
    document.title = `Puzzle Panda ${
      pageTitles[location.pathname] ? `| ${pageTitles[location.pathname]}` : ""
    }`;
  }, [location.pathname]);

  return (
    <ToastProvider>
      <Routes>
        <Route
          path="/admin/login"
          element={
            <AuthLayout>
              <AdminLogin />
            </AuthLayout>
          }
        />
        <Route path="/admin" element={<PrivateLayout />}>
          <Route path="users" element={<AdminUserTable />} />
          <Route path="date-config" element={<AdminDateConfig />} />
          <Route path="*" element={<Navigate to="users" replace />} />
          <Route index element={<Navigate to="users" replace />} />
        </Route>

        <Route path="/" element={<PublicLayout />}>
          <Route path="success" element={<SuccessPage />} />
          <Route path="book-now" element={<BookingForm />} />
          <Route path="how-it-works" element={<About />} />
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
};

export default App;
