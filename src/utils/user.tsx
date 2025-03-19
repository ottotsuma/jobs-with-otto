import { supabase } from "superbase";
import { User } from "@/types/users";
import { Dispatch, SetStateAction } from "react";

export async function fetchProfile(
  user: User,
  setUser: Dispatch<SetStateAction<null>>
) {
  // Step 1: Fetch the user's role from the user_roles table
  const { data: roleIDData, error: roleIDError } = await supabase
    .from("user_roles")
    .select("role_id")
    .eq("user_id", user.id)
    .single(); // Assuming each user has only one role

  if (roleIDError || !roleIDData?.role_id) {
    console.error("Error fetching role_id data:", roleIDError);
    return;
  }
  const { data: roleData, error: roleError } = await supabase
    .from("roles")
    .select("role_name")
    .eq("id", roleIDData.role_id)
    .single();
  if (roleError || !roleData?.role_name) {
    console.error("Error fetching role data:", roleError);
    return;
  }

  // Step 2: Based on the role, fetch the corresponding profile data
  let profileData;
  if (roleData.role_name === "applicant") {
    const { data, error } = await supabase
      .from("applicant_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (error) {
      console.error("Error fetching applicant profile data:", error);
      return;
    }
    profileData = data;
  } else if (roleData.role_name === "manager") {
    const { data, error } = await supabase
      .from("manager_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (error) {
      console.error("Error fetching manager profile data:", error);
      return;
    }
    profileData = data;
  } else if (roleData.role_name === "admin") {
    // Admins don't have a profile
    console.log("admin role");
  } else {
    console.log("anon role:", roleData.role_name);
    return;
  }

  // Step 3: Set the profile data to your state
  const mergedProfile = { ...user, ...profileData, ...roleData };
  mergedProfile.profileData = profileData;
  mergedProfile.roleData = roleData;
  setUser(mergedProfile); // Adjust this based on your state management
  localStorage.setItem("user", JSON.stringify(mergedProfile ?? null));
}

export async function updateRole(newRole, user, setUser) {
  try {
    // 1. Ensure the user is defined
    const userId = user?.id;
    if (!userId) throw new Error("User not found");

    // 2. Fetch the role's ID from the 'roles' table based on the new role name
    const { data: roleData, error: roleFetchError } = await supabase
      .from("roles")
      .select("id")
      .eq("role_name", newRole)
      .single();

    if (roleFetchError) throw roleFetchError;
    if (!roleData) throw new Error("Role not found in roles table");
    const roleId = roleData.id;

    // 3. Update the user's role in the 'user_roles' table using the fetched role ID
    const { error: updateRoleError } = await supabase
      .from("user_roles")
      .update({ role_id: roleId })
      .eq("user_id", userId);

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
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
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
