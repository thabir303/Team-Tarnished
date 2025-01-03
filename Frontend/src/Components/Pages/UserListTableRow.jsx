import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const UserListTableRow = ({ user }) => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { _id, email, name, photo, role, totalPdf } = user;

  const handleUserDetail = () => {
    navigate(`/profile/${_id}`);
  };
  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <img src={photo} alt="Avatar Tailwind CSS Component" />
            </div>
          </div>
          <div>
            <div className="font-bold">{name}</div>
          </div>
        </div>
      </td>
      <td>{email}</td>
      <td>{totalPdf}</td>
      <th>
        <button onClick={handleUserDetail} className="btn btn-ghost btn-xs">profile</button>
      </th>
    </tr>
  );
};

export default UserListTableRow;
