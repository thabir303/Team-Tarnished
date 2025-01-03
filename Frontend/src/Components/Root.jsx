import { Outlet } from "react-router-dom";
import ModifiedNavbar from "./Common/ModifiedNavbar";

const Root = () => {
  // const location = useLocation();
  // console.log(location);
  // const homePage = location.pathname.includes('home');
  // const loginPage = location.pathname.includes('login');
  return (
    <div className="bg-[#F3F3E6] min-h-screen">
      <ModifiedNavbar></ModifiedNavbar>
      <Outlet></Outlet>
    </div>
  );
};

export default Root;
