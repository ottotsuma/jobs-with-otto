'use client';
import { useState, useEffect } from "react";
import { supabase } from "superbase";
import { useUser } from '@/contexts/UserContext';
import { fetchProfile } from '@/utils/user';
import { useRouter } from "next/navigation";
export default function ProfilePage() {
    const router = useRouter();
    const { user, setUser } = useUser();
    const [profile, setProfile] = useState({});
    const [password, setPassword] = useState("");
    const blockedValues = ["id", "user_id", "created_at", "updated_at"];
    useEffect(() => {
        if (user && user?.profileData) {
            console.log(user)
            setProfile(user?.profileData)
        } else if (!user) {
            router.push('/');
        } else {
            console.log(user)
            console.log('user, but no profile')
        }
    }, []);

    async function updateProfile(e) {
        e.preventDefault();
        console.log(user)
        return;
        const table =
            user.role_name === "manager"
                ? "manager_profiles"
                : user.role_name === "admin"
                    ? "admin_profiles"
                    : "applicant_profiles";

        const { UserError } = await supabase.auth.admin.updateUserById(
            'user_id', // Replace with the user's ID
            {
                email: 'newemail@example.com',
                phone: '1234567890',
                // password: 'newpassword',
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
            fetchProfile(user, setUser)
            alert("Profile updated!");
        }
    }
    async function updateOttoProfile(e) {
        e.preventDefault();
        const { error } = await supabase
            .from('profiles')
            .update({
                username: 'otto',
                first_name: 'Otto',
                last_name: 'Octavius'
            })
            .eq('id', 1);
        if (error) {
            console.error('Error updating profile:', error.message);
        } else {
            console.log('Profile updated successfully');
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

        // Delete profile from the profile table
        const { error: profileError } = await supabase
            .from(table)
            .delete()
            .eq("user_id", user.id);

        if (profileError) {
            console.error("Error deleting profile:", profileError);
            alert("Failed to delete profile.");
            return;
        }

        // Delete user from authentication
        const { error: authError } = await supabase.auth.admin.deleteUser(user.id);

        if (authError) {
            console.error("Error deleting user:", authError);
            alert("Profile deleted, but failed to remove authentication.");
        } else {
            alert("Profile and account deleted successfully.");
            router.push("/"); // Redirect user after deletion
        }
    }
    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>
            <>
                {/* Profile Form */}
                <form onSubmit={updateProfile} className="space-y-4">
                    {Object.entries(profile)
                        .filter(([key]) => !blockedValues.includes(key)) // Filter out blocked keys
                        .map(([key, value]) => (
                            <div key={key}>
                                <label className="block font-semibold">{key}</label>
                                <input
                                    type="text"
                                    value={value || ""}
                                    onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        ))}

                    <button type="submit" className="bg-green-500 text-white p-2 rounded">
                        Update Profile
                    </button>
                </form>

                {/* Password Update Form */}
                <h2 className="text-xl font-bold mt-6">Change Password</h2>
                <form onSubmit={updatePassword} className="space-y-4">
                    <div>
                        <label className="block font-semibold">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        Update Password
                    </button>
                </form>
            </>
            <button
                onClick={deleteProfile}
                className="bg-red-500 text-white p-2 rounded mt-4"
            >
                Delete Profile
            </button>

        </div>
    );
}
