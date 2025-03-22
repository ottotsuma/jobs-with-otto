
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useLocale } from "@/app/[locale]/hooks/useLocal";
export function useUserRole(requiredRole) {
    const [hasAccess, setHasAccess] = useState(false);
    const router = useRouter();
    const currentLocale = useLocale();
    useEffect(() => {
        const checkUserRole = async () => {
            const user = supabase.auth.user();
            if (user) {
                const userRole = user.role; // Assuming 'role' is the custom claim added
                if (userRole === requiredRole) {
                    setHasAccess(true);
                } else {
                    router.push(`/${currentLocale}/unauthorized`); // Redirect to an unauthorized page
                }
            } else {
                router.push(`/${currentLocale}/login`); // Redirect to the login page if not authenticated
            }
        };

        checkUserRole();
    }, [requiredRole, router]);

    return hasAccess;
}
