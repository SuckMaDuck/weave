import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContext';

const ProtectedRoutes = () => {
  const { isLoggedIn } = useContext(LoginContext);

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
