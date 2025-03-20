// /components/ProtectedRoute.js

import { useUser } from './UserContext';
import { useRouter } from 'next/navigation';
import Loading from '@/components/loading';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useUser();
    const router = useRouter();

    if (!user) {
        // return <div><Loading /></div>; // Or redirect to login
        // router.push('/')
    }

    if (!allowedRoles.includes(user?.role_name)) {
        // router.push('/unauthorized'); // Redirect to unauthorized page
        return null;
    }

    return children;
};

export default ProtectedRoute;
