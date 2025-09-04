import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default RequireAuth;
