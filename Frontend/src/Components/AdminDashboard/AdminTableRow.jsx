import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { Check, X, FileText } from "lucide-react";

const AdminTableRow = ({ test }) => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { _id, accepted, fileUrl } = test;

  const handleAccept = async (id) => {
    try {
      await axiosSecure.patch(`http://localhost:9000/api/v1/test/${id}`, { accepted: true });
    } catch (error) {
      console.error("Error accepting test:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosSecure.patch(`http://localhost:9000/api/v1/test/${id}`, { accepted: false });
    } catch (error) {
      console.error("Error rejecting test:", error);
    }
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <FileText className="h-4 w-4 text-gray-400" />
          <a 
            href={`http://localhost:9000${fileUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            View File
          </a>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
          accepted === true ? "bg-green-50 text-green-700 border-green-100" :
          accepted === false ? "bg-red-50 text-red-700 border-red-100" :
          "bg-yellow-50 text-yellow-700 border-yellow-100"
        }`}>
          {accepted === true ? "Accepted" : 
           accepted === false ? "Rejected" : 
           "Pending"}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAccept(_id)}
            disabled={accepted === true}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${accepted === true 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-green-50 text-green-600 hover:bg-green-100"}`}
          >
            <Check className="h-4 w-4" />
            Accept
          </button>
          <button
            onClick={() => handleReject(_id)}
            disabled={accepted === false}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${accepted === false
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-red-50 text-red-600 hover:bg-red-100"}`}
          >
            <X className="h-4 w-4" />
            Reject
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AdminTableRow;