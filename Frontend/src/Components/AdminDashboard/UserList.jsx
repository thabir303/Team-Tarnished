import { useContext, useEffect, useState } from "react";
import UserListTableRow from "./UserListTableRow";
import Swal from "sweetalert2";
import { AuthContext } from "../Authentication/AuthProvider";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const { user, createUser, logOut } = useContext(AuthContext);

  useEffect(() => {
    axiosSecure
      .get("http://loalhost:3000/api/v1/user")
      .then((res) => {
        const filteredUsers = res.data.data.filter(
          (u) => u.email !== user.email
        );
        setUsers(filteredUsers);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [axiosSecure, user]);
  const handleAddUser = () => {
    let nameInput, emailInput, phoneInput, passwordInput, roleInput;

    Swal.fire({
      title: "Add New User",
      html: `
        <input type="text" id="name" class="swal2-input" placeholder="Name">
        <input type="email" id="email" class="swal2-input" placeholder="Email">
        <input type="text" id="phone" class="swal2-input" placeholder="Phone">
        <input type="password" id="password" class="swal2-input" placeholder="Password(Default:Ujjal123)">
        <select id="role" class="swal2-input">
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
        </select>
      `,
      confirmButtonText: "Add User",
      focusConfirm: false,
      didOpen: () => {
        const popup = Swal.getPopup();
        nameInput = popup.querySelector("#name");
        emailInput = popup.querySelector("#email");
        phoneInput = popup.querySelector("#phone");
        passwordInput = popup.querySelector("#password");
        roleInput = popup.querySelector("#role");
      },
      preConfirm: () => {
        const name = nameInput.value;
        const email = emailInput.value;
        const phone = phoneInput.value;
        let password = passwordInput.value;
        if (password == "") {
          password = "Ujjal123";
        }
        const role = roleInput.value;

        if (!name || !email || !phone) {
          Swal.showValidationMessage(`Please fill out all required fields`);
          return false;
        }

        return { name, email, phone, password, role };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { name, email, phone, password, role } = result.value;
        createUser(email, password)
          .then(() => {
            axiosSecure
              .post("http://loalhost:3000/api/v1/user/create-user", {
                name,
                email,
                phone,
                password,
                role,
              })
              .then((res) => {
                console.log(res);
                setUsers((prevUsers) => [...prevUsers, res.data.data]);
                Swal.fire("Success!", "User has been added.", "success");
                logOut().then(() => {
                  navigate("/login");
                });
              })
              .catch((error) => {
                Swal.fire("Error!", "There was an error in local.", "error");
                console.error(error);
              });
          })
          .catch((error) => {
            Swal.fire("Error!", "There was an error in firebase.", "error");
            console.error(error);
          });
      }
    });
  };

  return (
    <div className="w-full pb-10">
      <div className="w-full flex justify-center">
        <div className="overflow-x-auto bg-gray-50 rounded-lg">
          <table className="table">
            {/* head */}
            <thead className="bg-[#eceaea]">
              <tr className="text-2xl font-serif font-bold">
                <th className="border-2 border-b-[#FFD576]">Created</th>
                <th className="border-2 border-b-[#FFD576]">Name</th>
                <th className="border-2 border-b-[#FFD576]">Email</th>
                <th className="border-2 border-b-[#FFD576]">Phone</th>
                <th className="border-2 border-b-[#FFD576]">Role</th>
                <th className="border-2 border-b-[#FFD576]">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {users.map((user) => (
                <UserListTableRow key={user._id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full flex justify-center mt-10">
        <button
          onClick={handleAddUser}
          className="btn bg-[#0ba91ba5] text-white"
        >
          + Add User
        </button>
      </div>
    </div>
  );
};

export default UserList;
