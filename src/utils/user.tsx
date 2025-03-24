import { supabase } from "superbase";
import { User } from "@/types/users";
import { Dispatch, SetStateAction } from "react";

export async function fetchProfile(
  user: User,
  setUser: Dispatch<SetStateAction<null>>
) {
  if (!user || !user.id) {
    console.warn("Invalid user object provided.");
    return;
  }

  try {
    console.log("getting role");
    // Step 1: Fetch the user's role
    let { data: roleIDData, error: roleIDError } = await supabase
      .from("user_roles")
      .select("role_id")
      .eq("user_id", user.id)
      .single();
    console.log(roleIDData, "got role");
    // If user has no role, assign role_id = 4
    if (roleIDError || !roleIDData?.role_id) {
      console.warn("User has no assigned role. Assigning role_id = 4 (anon).");

      const { error: insertError } = await supabase
        .from("user_roles")
        .insert([{ user_id: user.id, role_id: 4 }]);

      if (insertError) {
        console.error("Error assigning default role:", insertError);
        return;
      }

      // Fetch role_id again after inserting
      roleIDData = { role_id: 4 };
    }
    console.log("getting role 2", roleIDData);

    // Step 2: Fetch the role name
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("role_name")
      .eq("id", roleIDData.role_id)
      .single();

    if (roleError) {
      console.error("Error fetching role data:", roleError);
      return;
    }

    if (!roleData?.role_name) {
      console.warn("Role not found.");
      return;
    }
    console.log("getting role 3", roleIDData);

    let profileData = null;

    // Step 3: Fetch the corresponding profile data based on the role
    if (roleData?.role_name === "applicant") {
      const { data, error } = await supabase
        .from("applicant_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) console.warn("No applicant profile found:", error);
      profileData = data || null;
    } else if (roleData?.role_name === "manager") {
      const { data, error } = await supabase
        .from("manager_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) console.warn("No manager profile found:", error);
      profileData = data || null;
    } else if (roleData?.role_name === "admin") {
      console.log("Admin role - no profile needed.");
    } else {
      console.warn("Unknown role:", roleData.role_name);
    }
    console.log("getting role 4", roleIDData);

    // Step 4: Merge and store user data
    const mergedProfile = {
      ...user,
      role: roleData.role_name,
      profile: profileData,
    };
    console.log("User set:", mergedProfile);
    setUser({ ...mergedProfile });
    localStorage.setItem("user", JSON.stringify(mergedProfile ?? null));
  } catch (error) {
    console.error("Unexpected error fetching profile:", error);
  }
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
