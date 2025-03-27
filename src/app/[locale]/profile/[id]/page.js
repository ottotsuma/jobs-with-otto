"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "superbase";
import { styled } from "@stitches/react";
import { useTheme } from "next-themes";
import { useTitle } from "@/contexts/TitleContext";
import Loading from "@/components/loading";
const ProfileContainer = styled("div", {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    color: 'black',
    theme: {
        true: {
            backgroundColor: '#fff',
            color: '#333',
        },
        false: {
            backgroundColor: '#1C1C1C',
            color: "WhiteSmoke"
        }
    }
});

const Title = styled("h1", {
    fontSize: "24px",
    marginBottom: "10px",
});

const ProfileDetail = styled("p", {
    fontSize: "16px",
    color: "#333",
    marginBottom: "8px",
});

export default function ProfilePage({ params }) {
    const resolvedParams = use(params);
    const { id, locale } = resolvedParams;
    const { theme } = useTheme();
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { setTitle } = useTitle();
    useEffect(() => {
        setTitle("Profile Page");
    }, []);
    useEffect(() => {
        async function fetchProfile() {
            const { data, error } = await supabase
                .from("applicant_profiles")
                .select("*")
                .eq("user_id", id)
                .single();

            if (error) {
                setError(error.message);
            } else {
                setProfile(data);
            }
            setLoading(false);
        }
        fetchProfile();
    }, [id]);

    if (loading) return <Loading />;
    if (error) return <p>Error: {error}</p>;
    return (
        <ProfileContainer theme={theme === "dark" ? false : true}>
            <Title>Profile</Title>
            {profile ? (
                <>
                    <ProfileDetail><strong>Name:</strong> {profile.full_name || "No name provided"}</ProfileDetail>
                    <ProfileDetail><strong>Bio:</strong> {profile.bio || "No bio available"}</ProfileDetail>
                </>
            ) : (
                <p>Profile not found.</p>
            )}
        </ProfileContainer>
    );
}
