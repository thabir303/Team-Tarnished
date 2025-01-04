import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Authentication/AuthProvider";
import logo from "/Logo.png";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import useAdmin from "../Hooks/useAdmin";

const ModifiedNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [dbuser, setUser] = useState(null);
  const { user, logOut } = useContext(AuthContext);

  useEffect(() => {
    axiosSecure
        .get(`http://localhost:3000/api/v1/user?email=${user?.email}`)
        .then((res) => {
            setUser(res.data.data[0]);
        })
        .catch((err) => {
            console.error("Failed to fetch user data:", err);
        });
}, [axiosSecure, user]);

  const handleLogOut = () => {
    logOut().then().catch();
  };

  const navLinks = (
    <>
      <li className="mr-10">
        <Link to="/">All PDFs</Link>
      </li>
      <li className="mr-10">
        <Link to="/users">Users</Link>
      </li>
      {
        dbuser?.role =='admin' ? (
          <li className="mr-1">
            <Link to="/adminDashboard">Admin Dashboard</Link>
          </li>
        ) : null
      }
    </>
  );

  const handleRedirect = () => {
    navigate(`/profile/${dbuser._id}`);
  };

  return (
    <div className={`px-8 w-full`}>
      <div className="navbar max-w-7xl mx-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              {navLinks}
            </ul>
          </div>
          <div className="hidden md:flex items-center ">
            <img className="w-28" src={logo} alt="" />
            {/* <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 inline-block text-transparent bg-clip-text">
              BanglishVerse
            </h1> */}
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navLinks}</ul>
        </div>
        <div className="navbar-end gap-4">
          {location.pathname != "/login" ? (
            user ? (
              <>
                <label onClick={handleRedirect} tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src={user?.photoURL} alt="photo" />
                  </div>
                </label>
                <button onClick={handleLogOut} className="btn z">
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login">
                <button className="btn z">Log In</button>
              </Link>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ModifiedNavbar;
