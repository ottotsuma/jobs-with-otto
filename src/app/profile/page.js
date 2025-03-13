'use client';
import { useState, useEffect } from "react";
import { supabase } from "superbase";

export default function ProfilePage() {
    const [profile, setProfile] = useState({});
    const [userType, setUserType] = useState(null);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        const { data: user, error } = await supabase.auth.getUser();
        if (error || !user) {
            console.error("Error fetching user:", error);
            return;
        }

        // Check if user is a manager
        let { data: managerData } = await supabase
            .from("manager_profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (managerData) {
            setProfile(managerData);
            setUserType("manager");
            setLoading(false);
            return;
        }

        // Otherwise, check if user is an applicant
        let { data: applicantData } = await supabase
            .from("applicants")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (applicantData) {
            setProfile(applicantData);
            setUserType("applicant");
        }

        setLoading(false);
    }

    async function updateProfile(e) {
        e.preventDefault();
        const table = userType === "manager" ? "manager_profiles" : "applicants";

        const { error } = await supabase
            .from(table)
            .update(profile)
            .eq("user_id", profile.user_id);

        if (error) {
            alert("Error updating profile");
            console.error(error);
        } else {
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
            {loading ? (
                <p>Loading...</p>
            ) : (
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
            )}
        </div>
    );
}
