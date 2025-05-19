import { Navigate, Outlet } from 'react-router-dom';
import AdminNavbar from '../../components/admin-navbar';

const PrivateLayout = ({ children }) => {
    const token = localStorage.getItem("accessToken");
    if(!token){
        return <Navigate to="/admin/login" replace />
    }
    return (
      <div>
        <AdminNavbar />
        <div><Outlet /></div>
      </div>
    );};

export default PrivateLayout;
