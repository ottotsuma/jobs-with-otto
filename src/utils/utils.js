import { supabase } from "superbase";

export async function checkFirstLogin(user) {
    const userMetadata = user?.user_metadata || {};

    if (userMetadata.first_login === undefined) {
        // It's the user's first login
        // You can update the user metadata here
        const { error } = await supabase.auth.updateUser({
            data: { first_login: true },
        });

        if (error) {
            console.error('Error updating user metadata:', error);
        }

        console.log("Welcome! This is your first login.");
    } else {
        console.log(`Welcome back ${user.id}`);
    }
}
