import { Link } from "react-router-dom";

const AdminNav = () => {
  const navLinks = (
    <>
      <li className="mr-1">
        <Link to="/home/adminDashboard/users">Users</Link>
      </li>
    </>
  );

  return (
    <div className="w-full flex justify-center">
      <div className="mx-auto navbar-center flex my-5">
        {/* <ul className="menu menu-dropdown md:menu-horizontal  px-3 gap-5">{navLinks}</ul> */}
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-5">{navLinks}</ul>
      </div>
    </div>
  );
};

export default AdminNav;
