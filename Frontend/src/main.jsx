import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import PrivateRoute from './Components/Authentication/PrivateRoute';
import AdminRoute from './Components/Authentication/AdminRoute';
import ErrorPage from './ErrorPage';
import Login from './Components/Authentication/Login';
import Root from './Components/Root';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import AuthProvider from './Components/Authentication/AuthProvider';
import { QueryClient, QueryClientProvider  } from '@tanstack/react-query';
import SignUp from './Components/Authentication/SignUp';
import Home from './Components/Pages/Home';
import Profile from './Components/Pages/Profile';
import UserList from './Components/Pages/UserList';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/",
        element: <Home></Home>
      },
      {
        path: "login",
        element: <Login></Login>,
      },
      {
        path: "signup",
        element: <SignUp></SignUp>,
      },
      {
        path: "profile/:id",
        element: (
          <Profile></Profile>
        ),
      },
      {
        path: "users",
        element: <UserList></UserList>,
      },
      {
        path: "adminDashboard",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AdminDashboard></AdminDashboard>
            </AdminRoute>
          </PrivateRoute>
        ),
        children: [
          {
            path: "users",
            element: (
              <PrivateRoute>
                <AdminRoute>
                  <h1>Hello</h1>
                </AdminRoute>
              </PrivateRoute>
            ),
          },

        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
)
