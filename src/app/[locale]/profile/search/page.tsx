"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "superbase";
import { styled } from "@stitches/react";
import { Container, Title } from "@/styles/basic";
import { useLocale } from "@/app/[locale]/hooks/useLocal";
import { Vacancy } from "@/types/candidates";
import { useTitle } from "@/contexts/TitleContext";
import { formatDate } from "@/utils/utils";
const Grid = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "16px",
});

const Card = styled(Link, {
  display: "block",
  padding: "16px",
  borderRadius: "12px",
  backgroundColor: "#ffffff",
  textDecoration: "none",
  color: "black",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
  },
});

const CardTitle = styled("h2", {
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: "8px",
});

const CardDetails = styled("p", {
  fontSize: "14px",
  marginBottom: "8px",
});

const DetailRow = styled("div", {
  marginBottom: "8px",
});

export default function CandidatesPage() {
  const currentLocale = useLocale();
  const [candidates, setCandidates] = useState<Vacancy[]>([]);
  const { setTitle } = useTitle();
  useEffect(() => {
    setTitle("Candidates");
    async function fetchVacancies() {
      const { data, error } = await supabase
        .from("applicant_profiles")
        .select("*");
      if (!error) setCandidates(data);
    }
    fetchVacancies();
  }, []);

  return (
    <Container>
      <Title>Candidates</Title>
      <Grid>
        {candidates.map((candidate) => (
          <Card key={candidate.user_id} href={`${candidate.user_id}`}>
            <CardTitle>
              <strong>Name:</strong> {candidate.full_name}
            </CardTitle>
            <CardDetails>
              <strong>Location:</strong> {candidate.location}
            </CardDetails>
            <DetailRow>
              <strong>experience:</strong> {candidate.experience}
            </DetailRow>
            <DetailRow>
              <strong>bio:</strong> {candidate.bio}
            </DetailRow>{" "}
            <DetailRow>
              <strong>resume_url:</strong> {candidate.resume_url}
            </DetailRow>{" "}
            <DetailRow>
              <strong>skills:</strong> {candidate.skills}
            </DetailRow>
            <DetailRow>
              <strong>updated_at:</strong> {formatDate(candidate.updated_at)}
            </DetailRow>
          </Card>
        ))}
      </Grid>
    </Container>
  );
}
