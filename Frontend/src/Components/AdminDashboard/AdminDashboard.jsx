import { Outlet } from "react-router-dom";
import AdminNav from "./AdminNav";

const AdminDashboard = () => {
    return (
        <div>
            <AdminNav></AdminNav>
            <Outlet></Outlet>
        </div>
    );
};

export default AdminDashboard;