import Swal from "sweetalert2";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const UserListTableRow = ({ user }) => {
  const axiosSecure = useAxiosSecure();

  const { _id, email, name, phone, role, createdAt } = user;
  const formattedCreatedAt = new Date(createdAt).toISOString().split("T")[0];

  const handleDeleteUser = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`http://loalhost:3000/api/v1/user/${_id}`)
          .then((res) => {
            if (res.status === 200) {
              window.location.reload();
            }
          })
          .catch((error) => console.error(error));
      }
    });
  };
  const handleUpdateUser = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`http://loalhost:3000/api/v1/user/${_id}`, {
            role: "admin",
          })
          .then((res) => {
            if (res.status === 200) {
              window.location.reload();
            }
          })
          .catch((error) => console.error(error));
      }
    });
  };
  return (
    <tr className="text-lg">
      <th>{formattedCreatedAt}</th>
      <td>{name}</td>
      <td>{email}</td>
      <td>{phone}</td>
      <td>{role}</td>
      <td>
        {role === "admin" ? (
          <button
            onClick={handleDeleteUser}
            className="btn bg-[#ff4545c6] text-white"
          >
            Remove
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleUpdateUser}
              className="btn bg-[#0ba91ba5] text-white"
            >
              Make Admin
            </button>
            <button
              onClick={handleDeleteUser}
              className="btn bg-[#ff4545c6] text-white"
            >
              Remove
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default UserListTableRow;
