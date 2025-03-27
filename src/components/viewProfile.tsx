"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "superbase";
import { styled } from "@stitches/react";
import Loading from "@/components/loading";
import { useTheme } from "next-themes";
import { useTitle } from "@/contexts/TitleContext";
const ProfileContainer = styled("div", {
  margin: "auto",
  height: "100%",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  backgroundColor: "#fff",
  color: "black",
  theme: {
    true: {
      backgroundColor: "#fff",
      color: "#333",
    },
    false: {
      backgroundColor: "#1C1C1C",
      color: "WhiteSmoke",
    },
  },
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

export default function ViewProfile({ user_id }) {
  const { theme } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setTitle } = useTitle();
  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from("applicant_profiles")
        .select("*")
        .eq("user_id", user_id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setProfile(data);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [user_id]);

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;
  return (
    <ProfileContainer theme={theme === "dark" ? false : true}>
      <Title>Profile</Title>
      {profile ? (
        <>
          <ProfileDetail>
            <strong>Name:</strong> {profile.full_name || "No name provided"}
          </ProfileDetail>
          <ProfileDetail>
            <strong>Bio:</strong> {profile.bio || "No bio available"}
          </ProfileDetail>
        </>
      ) : (
        <p>Profile not found.</p>
      )}
    </ProfileContainer>
  );
}
