// UserList.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Authentication/AuthProvider"; // Ensure AuthProvider is correctly imported
import useAxiosSecure from "../Hooks/useAxiosSecure"; // Ensure this hook is properly implemented
import UserListTableRow from "./UserListTableRow"; // Ensure the table row component is correctly imported
import { Users, Search, Loader2 } from "lucide-react"; 

const UserList = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosSecure.get("http://localhost:3000/api/v1/user");
        setUsers(res.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [axiosSecure, user]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Users className="h-5 w-5 opacity-50" />
            <h2 className="text-lg font-medium">Platform Users</h2>
            <span className="px-2.5 py-1 bg-black/5 rounded-md text-sm">
              {users.length} Total
            </span>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-black/5 rounded-lg placeholder:opacity-50 focus:outline-none focus:ring-1 focus:ring-black/10"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left font-medium px-4 py-3 text-sm opacity-50">User</th>
              <th className="text-left font-medium py-3 text-sm opacity-50">Email</th>
              <th className="text-left font-medium py-3 text-sm opacity-50">PDFs</th>
              <th className="text-left font-medium py-3 pr-4 text-sm opacity-50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <UserListTableRow key={user._id} user={user} />
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center opacity-50">
                  No users found matching your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;