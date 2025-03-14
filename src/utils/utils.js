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

export async function updateRole(newRole) {
    try {
        // 1. Ensure the user is defined
        const userId = user?.id;
        if (!userId) throw new Error("User not found");

        // 2. Fetch the role's ID from the 'roles' table based on the new role name
        const { data: roleData, error: roleFetchError } = await supabase
            .from('roles')
            .select('id')
            .eq('role_name', newRole)
            .single();

        if (roleFetchError) throw roleFetchError;
        if (!roleData) throw new Error("Role not found in roles table");
        const roleId = roleData.id;

        // 3. Update the user's role in the 'user_roles' table using the fetched role ID
        const { error: updateRoleError } = await supabase
            .from('user_roles')
            .update({ role_id: roleId })
            .eq('user_id', userId);

        if (updateRoleError) throw updateRoleError;

        // 4. Clean up profiles from tables that don't correspond to the new role
        //   const profileTables = ['applicant_profiles', 'manager_profiles', 'admin_profiles'];
        const newProfileTable = `${newRole}_profiles`;

        //   for (let table of profileTables) {
        //     if (table !== newProfileTable) {
        //       const { error: deleteError } = await supabase
        //         .from(table)
        //         .delete()
        //         .eq('user_id', userId);
        //       if (deleteError) {
        //         console.error(`Error deleting from ${table}:`, deleteError);
        //       }
        //     }
        //   }

        // 5. Ensure the user has a profile in the new role's table
        const { data: existingProfile, error: fetchError } = await supabase
            .from(newProfileTable)
            .select('*')
            .eq('user_id', userId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError;
        }

        if (!existingProfile) {
            const { error: insertError } = await supabase
                .from(newProfileTable)
                .insert([{ user_id: userId, created_at: new Date().toISOString() }]);
            if (insertError) throw insertError;
        }

        // 6. Update local state for the user
        if (user) {
            const tempUser = structuredClone(user);
            tempUser.role_name = newRole;
            fetchProfile(tempUser, setUser);
        }
        //   setUser({ ...user, role_name: newRole });
        alert("Role updated successfully!");
    } catch (error) {
        console.error("Error updating role:", error);
        alert(`Error updating role: ${error.message}`);
    }
}