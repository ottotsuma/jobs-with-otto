// /components/ProtectedRoute.js

import { useUser } from '../context/UserContext';
import { useRouter } from 'next/router';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useUser();
    const router = useRouter();

    if (!user) {
        return <div>Loading...</div>; // Or redirect to login
    }

    if (!allowedRoles.includes(user.role)) {
        router.push('/unauthorized'); // Redirect to unauthorized page
        return null;
    }

    return children;
};

export default ProtectedRoute;
