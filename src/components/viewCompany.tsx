"use client";
import { useEffect, useState } from "react";
import { supabase } from "superbase";
import Loading from "@/components/loading";
import {
  Button,
  Container,
  Title,
  Form,
  Input,
  ZoneGreen,
  ZoneRed,
  ZoneYellow,
  Label,
  Select,
} from "@/styles/basic";
import { useUser } from "@/contexts/UserContext";
export default function ViewCompany({ company_id }) {
  const { user, setUser } = useUser();
  const [company, setCompany] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  async function applyAsCompanyApplicant(user, companyId) {
    if (!user?.id || !companyId) {
      console.error("Missing user ID or company ID.");
      return;
    }

    const { error } = await supabase
      .from("company_applicant_applications")
      .insert([{ user_id: user.id, company_id: companyId, status: "pending" }]);

    if (error) {
      console.error("Error inserting application:", error);
    } else {
      console.log("Application submitted successfully.");
    }
  }
  async function applyAsCompanyManager(user, companyId) {
    if (!user?.id || !companyId) {
      console.error("Missing user ID or company ID.");
      return;
    }

    const { error } = await supabase
      .from("company_manager_applications")
      .insert([{ user_id: user.id, company_id: companyId, status: "pending" }]);

    if (error) {
      console.error("Error inserting application:", error);
    } else {
      console.log("Application submitted successfully.");
    }
  }
  useEffect(() => {
    if (!company_id) return;

    async function fetchCompany() {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", company_id)
        .single();
      if (!error) setCompany(data);
    }

    async function fetchVacancies() {
      const { data, error } = await supabase
        .from("vacancies")
        .select("*")
        .eq("company_id", company_id);
      if (!error) setVacancies(data);
    }

    fetchCompany();
    fetchVacancies();
  }, [company_id]);

  if (!company) return <Loading />;

  return (
    <Container>
      <Title>{company.name}</Title>
      <p className="text-gray-700">{company.description}</p>

      <h2 className="text-xl font-bold mt-4">Vacancies</h2>
      {vacancies.length > 0 ? (
        <ul>
          {vacancies.map((vacancy) => (
            <li key={vacancy.id} className="mb-2">
              <p className="font-semibold">{vacancy.job_title}</p>
              <p>{vacancy.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No vacancies available.</p>
      )}
      {/* Comments/rating */}
      {user?.role === "manager" && (
        <Button
          onClick={() => {
            applyAsCompanyManager(user, company_id);
          }}
        >
          Apply to join company as manager
        </Button>
      )}
      {user?.role === "applicant" && (
        <Button
          onClick={() => {
            applyAsCompanyApplicant(user, company_id);
          }}
        >
          Apply to join company as worker
        </Button>
      )}
    </Container>
  );
}
