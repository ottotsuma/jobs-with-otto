// /components/ProtectedRoute.js

import { useUser } from './UserContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useUser();

    if (!allowedRoles.includes(user?.role_name)) {
        return null;
    }

    return children;
};

export default ProtectedRoute;
