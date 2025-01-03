/* eslint-disable react/prop-types */
import { Navigate, useLocation } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import useAdmin from '../Hooks/useAdmin';
import { toast } from 'react-toastify'

const AdminRoute = ({children}) => {
    const {user} = useContext(AuthContext);
    const location = useLocation()
    const [isAdmin,isLoading] = useAdmin();
    if(isLoading){
       return <progress className='progress w-full'></progress>
    }
    if(user && isAdmin=="admin"){
        return children
    }
    else{
        toast('Admin Protected Route!')
        return <Navigate to='/' state={{from:location}} replace={true}></Navigate>
    }
  
}

export default AdminRoute