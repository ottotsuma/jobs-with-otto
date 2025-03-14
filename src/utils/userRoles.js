
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export function useUserRole(requiredRole) {
    const [hasAccess, setHasAccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkUserRole = async () => {
            const user = supabase.auth.user();
            if (user) {
                const userRole = user.role; // Assuming 'role' is the custom claim added
                if (userRole === requiredRole) {
                    setHasAccess(true);
                } else {
                    router.push('/unauthorized'); // Redirect to an unauthorized page
                }
            } else {
                router.push('/login'); // Redirect to the login page if not authenticated
            }
        };

        checkUserRole();
    }, [requiredRole, router]);

    return hasAccess;
}
