import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Authentication/AuthProvider";
import UserListTableRow from "./UserListTableRow";

const UserList = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axiosSecure
      .get("http://localhost:3000/api/v1/user")
      .then((res) => {
        const filteredUsers = res.data.data.filter(
          (fuser) => fuser.email === user.email 
        );
        setUsers(filteredUsers);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [axiosSecure, user]);

  return (
    <div className="w-full flex justify-center">
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Total PDFs</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserListTableRow key={user._id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
