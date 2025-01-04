import axios from "axios";
import { use } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const AdminTableRow = ({test}) => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { _id, accepted, fileUrl } = test;

    const handleAccept = async (id) => {
        axiosSecure.patch(`http://localhost:9000/api/v1/test/${id}`, {accepted: true})
    }
    const handleReject = async (id) => {
        axiosSecure.patch(`http://localhost:9000/api/v1/test/${id}`, {accepted: false})
    }
  
    return (
      <tr className="border-b border-gray-100 last:border-none hover:bg-black/5">
        
        <td className="py-3">
          <span className="px-10 py-1 bg-black/5 rounded-md text-sm">
          http://localhost:9000{fileUrl}
          </span>
        </td>
        <td className="py-3 pr-4">
          <button
            onClick={() => handleAccept(_id)}
            className="px-3 py-1.5 text-sm font-medium hover:bg-black/5 rounded-md transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => handleReject(_id)}
            className="px-3 py-1.5 text-sm font-medium hover:bg-black/5 rounded-md transition-colors"
          >
            Reject
          </button>
        </td>
      </tr>
    );
  };

export default AdminTableRow;