'use client';
import { useState, useEffect } from "react";
import { supabase } from "superbase";
import { useUser } from '@/contexts/UserContext';
import { fetchProfile } from '@/utils/user';

export default function ProfilePage() {
    const { user, setUser } = useUser();
    const [profile, setProfile] = useState({});
    const [password, setPassword] = useState("");

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

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>
            <>
                {/* Profile Form */}
                <form onSubmit={updateProfile} className="space-y-4">
                    {Object.entries(profile).map(([key, value]) =>
                        key !== "user_id" ? (
                            <div key={key}>
                                <label className="block font-semibold">{key}</label>
                                <input
                                    type="text"
                                    value={value || ""}
                                    onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        ) : null
                    )}
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
        </div>
    );
}
