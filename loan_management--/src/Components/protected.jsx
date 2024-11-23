import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAllowed }) => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken || (isAllowed !== undefined && !isAllowed)) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
