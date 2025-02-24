import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAllowed, redirectTo }) => {
    return isAllowed ? <Outlet /> : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;
