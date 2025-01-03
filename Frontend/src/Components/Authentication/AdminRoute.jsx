/* eslint-disable react/prop-types */
import { Navigate, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthProvider';
import { toast } from 'react-toastify';
import useAxiosSecure from '../Hooks/useAxiosSecure';

const AdminRoute = ({ children }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [dbuser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const location = useLocation();

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`http://localhost:3000/api/v1/user?email=${user.email}`)
        .then((res) => {
          setDbUser(res.data.data[0]);
        })
        .catch((err) => {
          console.error('Failed to fetch user data:', err);
        })
        .finally(() => {
          setLoading(false); 
        });
    } else {
      setLoading(false); 
    }
  }, [axiosSecure, user]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (user && dbuser?.role === 'admin') {
    return children;
  } else {
    toast('Admin Protected Route!');
    return <Navigate to='/' state={{ from: location }} replace={true} />;
  }
};

export default AdminRoute;
