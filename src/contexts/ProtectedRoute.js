// /components/ProtectedRoute.js

import { useUser } from './UserContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useUser();

    if (!allowedRoles.includes(user?.role)) {
        return null;
    }

    return children;
};

export default ProtectedRoute;
