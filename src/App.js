
import React, { useEffect } from 'react';
import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';

import {
  ChakraProvider,
} from '@chakra-ui/react';

export default function Main() {

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to='/auth/login' />;
  };


  useEffect(() => {
    // 5 Hours in milliseconds
    // 5 * 60 minutes * 60 seconds * 1000 milliseconds
    const FIVE_HOURS_IN_MS = 5 * 60 * 60 * 1000;

    const checkAutoLogout = () => {
      const loginTime = localStorage.getItem('loginTime');
      const token = localStorage.getItem('token');

      if (token && loginTime) {
        const currentTime = Date.now();
        const timeElapsed = currentTime - parseInt(loginTime);

        // Agar 5 ghante se jyada ho gaye hain
        if (timeElapsed > FIVE_HOURS_IN_MS) {
          performLogout();
        } else {
          // Agar time bacha hai, to bache hue time ke liye automatic timer set kar do
          const remainingTime = FIVE_HOURS_IN_MS - timeElapsed;

          // Background timer jo remaining time ke baad logout kar dega
          const timer = setTimeout(() => {
            performLogout();
          }, remainingTime);

          // Cleanup function (agar component unmount ho to timer clear ho jaye)
          return () => clearTimeout(timer);
        }
      }
    };

    const performLogout = () => {
      // LocalStorage clear karein
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('loginTime');

      // User ko inform karein (Optional)
      alert("Session expired! Please login again.");

      // Login page par redirect karein
      window.location.href = '/login';
    };

    checkAutoLogout();
  }, []);




  return (
    <ChakraProvider >
      <Routes>
        <Route path='auth/*' element={<AuthLayout />} />
        <Route
          path='admin/*'
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route path='/' element={<Navigate to='/admin' replace />} />
      </Routes>
    </ChakraProvider>
  );
}