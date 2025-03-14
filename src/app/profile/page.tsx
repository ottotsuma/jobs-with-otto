'use client';
import { useState, useEffect } from "react";
import { supabase } from "superbase";
import { ApplicantProfile, ManagerProfile, AdminProfile } from '@/types/users';
import { useUser } from '@/contexts/UserContext';
import { fetchProfile } from '@/utils/user';
import { useRouter } from "next/navigation";
import { Company } from '@/types/company';
import { Location } from '@/types/location';
import {Button, Container, Title, Form, Input, ZoneGreen, ZoneRed, ZoneYellow, Label, Select} from '@/styles/basic';
import ProtectedRoute from '@/contexts/ProtectedRoute.js';

export default function ProfilePage() {
    const router = useRouter();
    const { user, setUser } = useUser();
    const [profile, setProfile] = useState<ManagerProfile | ApplicantProfile | AdminProfile>({});
    const [password, setPassword] = useState("");
    const [locations, setLocations] = useState<Location[] | []>([]);
    const [companies, setCompanies] = useState<Company[] | []>([]);

    async function updateRole(newRole) {
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
          if(user){
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

    const blockedValues = ["id", "user_id", "created_at", "updated_at"];


    useEffect(() => {
        if (user && user?.profileData) {
            console.log(user);
            setProfile(user?.profileData);
        } else if (!user) {
            router.push('/');
        } else {
            console.log(user);
            console.log('user, but no profile');
        }
    }, [user]);

    async function updateProfile(e) {
        e.preventDefault();
        console.log(user, profile);
        return;
        const table =
            user.role_name === "manager"
                ? "manager_profiles"
                : user.role_name === "admin"
                    ? "admin_profiles"
                    : "applicant_profiles";

        const { UserError } = await supabase.auth.admin.updateUserById(
            'user_id',
            {
                email: 'newemail@example.com',
                phone: '1234567890',
                data: {
                    username: 'newusername',
                    first_name: 'John',
                    last_name: 'Doe'
                }
            }
        );

        const { error } = await supabase
            .from(table)
            .update(profile)
            .eq("user_id", profile.user_id);

        if (error || UserError) {
            alert("Error updating profile");
            console.error(error, UserError);
        } else {
            fetchProfile(user, setUser);
            alert("Profile updated!");
        }
    }

    async function updatePassword(e) {
        e.preventDefault();
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
            alert("Error updating password");
            console.error(error);
        } else {
            alert("Password updated!");
        }
    }

    async function deleteProfile() {
        if (!user || !user.id) {
            alert("User not found.");
            return;
        }

        const table =
            user.role_name === "manager"
                ? "manager_profiles"
                : user.role_name === "admin"
                    ? "admin_profiles"
                    : "applicant_profiles";

        const { error: profileError } = await supabase
            .from(table)
            .delete()
            .eq("user_id", user.id);

        if (profileError) {
            console.error("Error deleting profile:", profileError);
            alert("Failed to delete profile.");
            return;
        }

        const { error: authError } = await supabase.auth.admin.deleteUser(user.id);

        if (authError) {
            console.error("Error deleting user:", authError);
            alert("Profile deleted, but failed to remove authentication.");
        } else {
            alert("Profile and account deleted successfully.");
            localStorage.setItem('user', JSON.stringify(null));
            router.push("/");
        }
    }

    return (
        <ProtectedRoute allowedRoles={['admin', 'manager', 'applicant']}>
            <Container>
                <Title>My Profile</Title>
                <>
                    <p>{profile?.id}</p>
                    
                    {/* Green Zone - Update Profile Form */}
                    <ZoneGreen>
                        <Form onSubmit={updateProfile}>
                            {Object.entries(profile)
                                .filter(([key]) => !blockedValues.includes(key))
                                .map(([key, value]) => (
                                    key === "company_id" ? (
                                        <div key={key}>
                                            <Label>Company</Label>
                                            <Select
                                                name={key}
                                                value={value}
                                                onChange={() => {}}
                                            >
                                                <option value="">Select Company</option>
                                                {companies.map((company) => (
                                                    <option key={company.id} value={company.id}>
                                                        {company.name}
                                                    </option>
                                                ))}
                                            </Select>
                                        </div>
                                    ) : key === "location_ids" ? (
                                        <div key={key}>
                                            <Label>Locations</Label>
                                            <Select
                                                name={key}
                                                value={value || []}
                                                onChange={(e) => {
                                                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                                    setProfile({ ...profile, [key]: selectedOptions });
                                                }}
                                                multiple
                                            >
                                                <option value="">Select Location(s)</option>
                                                {locations.map((location) => (
                                                    <option key={location.id} value={location.id}>
                                                        {location.name}
                                                    </option>
                                                ))}
                                            </Select>
                                        </div>
                                    ) : (
                                        <div key={key}>
                                            <Label>{key}</Label>
                                            <Input
                                                type="text"
                                                value={value || ""}
                                                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                                            />
                                        </div>
                                    )
                                ))
                            }
                            <Button type="submit" color="green">
                                Update Profile
                            </Button>
                        </Form>
                    </ZoneGreen>

                    {/* Yellow Zone - Change Password & Role Update Forms */}
                    <ZoneYellow>
                        <h2>Change Password</h2>
                        <Form onSubmit={updatePassword}>
                            <div>
                                <Label>New Password</Label>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button type="submit" color="blue">
                                Update Password
                            </Button>
                        </Form>

                        <Form onSubmit={updateRole}>
                            <div>
                                {/* Need to be able to make a company, locations and then allocate users as managers, apply to companies, as manager or applicant */}
                                <Label>Role</Label>
                                <Select
                                    name="role"
                                    value={user?.role_name}
                                    onChange={(e) => updateRole(e.target.value)}
                                >
                                    <option value="manager">Manager</option>
                                    <option value="applicant">Applicant</option>
                                    {/* Uncomment if needed:
                                    <option value="admin">Admin</option>
                                    */}
                                </Select>
                            </div>
                        </Form>
                    </ZoneYellow>

                    {/* Red Zone - Delete Profile */}
                    <ZoneRed>
                        <Button onClick={deleteProfile} color="red">
                            Delete Profile (needs warning popup)
                        </Button> 
                    </ZoneRed>
                </>
            </Container>
            <footer>
                <Button onClick={() => router.push('/about')} color="blue">
                    about
                </Button>
                <Button onClick={() => router.push('/contact')} color="blue">
                contact
                </Button>
            </footer>
        </ProtectedRoute>
    );
}
