// UserList.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Authentication/AuthProvider"; // Ensure AuthProvider is correctly imported
import useAxiosSecure from "../Hooks/useAxiosSecure"; // Ensure this hook is properly implemented
import {  Loader2 } from "lucide-react"; 
import AdminTableRow from "./AdminTableRow";

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const [Tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axiosSecure.get("http://localhost:3000/api/v1/test");
        setTests(res.data.data);
      } catch (error) {
        console.error("Error fetching Tests:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTests();
  }, [axiosSecure, user]);


  if (isLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin opacity-50" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 opacity-50" />
            <h2 className="text-lg font-medium">Platform Tests</h2>
            <span className="px-2.5 py-1 bg-black/5 rounded-md text-sm">
              {Tests.length} Total
            </span>
          </div>
          
        </div>
      </div>

      <div className="bg-white rounded-xl border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left font-medium px-10 py-3 text-sm opacity-50">Test-Data</th>
              <th className="text-left font-medium py-3 pr-4 text-sm opacity-50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Tests.length > 0 ? (
              Tests.map(test => (
                <AdminTableRow key={test._id} test={test} />
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center opacity-50">
                  No Tests found matching your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;