// UserListTableRow.jsx
// import React from "react";
import { useNavigate } from "react-router-dom";

const UserListTableRow = ({ user }) => {
  const navigate = useNavigate();
  const { _id, email, name, photo, totalPdf } = user;

  return (
    <tr className="border-b border-gray-100 last:border-none hover:bg-black/5">
      <td className="py-3 pl-4">
        <div className="flex items-center gap-3">
          <img 
            src={photo} 
            alt={name}
            className="h-10 w-10 rounded-lg object-cover"
          />
          <span className="font-medium">{name}</span>
        </div>
      </td>
      <td className="py-3">{email}</td>
      <td className="py-3">
        <span className="px-2.5 py-1 bg-black/5 rounded-md text-sm">
          {totalPdf || 0} PDFs
        </span>
      </td>
      <td className="py-3 pr-4">
        <button
          onClick={() => navigate(`/profile/${_id}`)}
          className="px-3 py-1.5 text-sm font-medium hover:bg-black/5 rounded-md transition-colors"
        >
          View Profile
        </button>
      </td>
    </tr>
  );
};


export default UserListTableRow; 