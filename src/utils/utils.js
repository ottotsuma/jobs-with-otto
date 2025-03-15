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
        const { error: insertError } = await supabase
            .from('applicant_profiles')
            .insert([{ user_id: user.id, created_at: new Date().toISOString() }]);
        if (insertError) throw insertError;
    } else {
        console.log(`Welcome back ${user.id}`);
    }
}
