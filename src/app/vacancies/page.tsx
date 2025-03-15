'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "superbase";
import { styled } from "@stitches/react";
import { Container, Title } from "@/styles/basic";
import { Vacancy } from "@/types/vacancies";

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

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  useEffect(() => {
    async function fetchVacancies() {
      const { data, error } = await supabase.from("vacancies").select("*");
      if (!error) setVacancies(data);
      console.log(data, "vacancies");
    }
    fetchVacancies();
  }, []);

  return (
    <Container>
      <Title>Vacancies</Title>
      <Grid>
        {vacancies.map((vacancy) => (
          <Card key={vacancy.id} href={`/vacancies/${vacancy.id}`}>
            <CardTitle>{vacancy.job_title}</CardTitle>
            <CardDetails>{vacancy.description}</CardDetails>
            <DetailRow>
              <strong>Job Level:</strong> {vacancy.job_level}
            </DetailRow>
            <DetailRow>
              <strong>Salary:</strong>{" "}
              {vacancy.yearly_salary
                ? `$${vacancy.yearly_salary} / year`
                : vacancy.month_salary
                ? `$${vacancy.month_salary} / month`
                : vacancy.day_salary
                ? `$${vacancy.day_salary} / day`
                : vacancy.hourly_rate
                ? `$${vacancy.hourly_rate} / hour`
                : "N/A"}
            </DetailRow>
            {vacancy.special_instructions && (
              <DetailRow>
                <strong>Special Instructions:</strong> {vacancy.special_instructions}
              </DetailRow>
            )}
          </Card>
        ))}
      </Grid>
    </Container>
  );
}
