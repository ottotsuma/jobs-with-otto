"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "superbase";
import { useUser } from "@/contexts/UserContext";
import { styled } from "@stitches/react";
import { useLocale } from "@/app/[locale]/hooks/useLocal";
import { useTranslation } from "next-i18next";
import { Title } from "@/styles/basic";

const FormWrapper = styled("div", {
  margin: "0 auto",
  padding: "2rem",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
});

// Tab Container
const TabList = styled("div", {
  display: "flex",
  justifyContent: "space-around",
  marginBottom: "1rem",
  borderBottom: "2px solid #ddd",
});

// Individual Tab Item
const Tab = styled("button", {
  padding: "10px 20px",
  fontSize: "1rem",
  cursor: "pointer",
  background: "none",
  border: "none",
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: "#f4f4f4",
  },
  "&[aria-selected='true']": {
    borderBottom: "2px solid #0070f3",
    fontWeight: "bold",
  },
});

// Tab Panel Container
const TabPanel = styled("div", {
  display: "none",
  padding: "1rem",
  "&[aria-hidden='false']": {
    display: "block",
  },
});

const Tabs = styled("div", {
  display: "flex",
  flexDirection: "column",
  marginBottom: "1rem",
});

// Applicant Card
const ApplicantCard = styled("div", {
  padding: "1rem",
  marginBottom: "1rem",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#f9f9f9",
  cursor: "pointer",
  transition: "background-color 0.3s, box-shadow 0.3s",
  "&:hover": {
    backgroundColor: "#eef2ff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  "& h3": {
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
  },
  "& p": {
    fontSize: "1rem",
    color: "#555",
  },
});

// Empty State Message
const EmptyStateMessage = styled("p", {
  fontSize: "1rem",
  color: "#777",
  textAlign: "center",
  marginTop: "2rem",
});

export default function NewShift({
  vacancy_id,
  all_vacancies,
  onSelectApplicant,
}) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { user } = useUser();
  const [companyApplicants, setCompanyApplicants] = useState({
    companyApplicants: [],
    locationApplicants: [],
    openViewApplicants: [],
    appliedApplicants: [],
  });
  const [selectedTab, setSelectedTab] = useState("location");

  const handleTabChange = (tabId) => {
    setSelectedTab(tabId);
  };
  useEffect(() => {
    async function fetchApplicants(vacancyLocationId, vacancyCompanyId) {
      try {
        const { data: vacancyApplicants, error: vacancyError } = await supabase
          .from("vacancy_applicants")
          .select("user_id, application_status")
          .eq("vacancy_id", vacancy_id);

        if (vacancyError) throw vacancyError;

        // Extract user_ids from the fetched vacancy applicants
        const userIds = vacancyApplicants.map((applicant) => applicant.user_id);

        // Fetch applicants who match company, location, or have open_view = true
        const { data: companyLocationOpenApplicants, error: profileError } =
          await supabase
            .from("applicant_profiles")
            .select("*")
            .or(
              `company_id.eq.${vacancyCompanyId},location_id.eq.${vacancyLocationId},open_view.eq.true`
            );

        // Fetch applicants based on user_ids from the vacancy_applicants table (might overlap with the previous group)
        const { data: appliedApplicants, error: appliedError } = await supabase
          .from("applicant_profiles")
          .select("*")
          .in("id", userIds);

        if (profileError || appliedError) throw profileError || appliedError;

        // Combine the two groups, ensuring no duplicates
        const allApplicants = [
          ...companyLocationOpenApplicants,
          ...appliedApplicants.filter(
            (applicant) =>
              !companyLocationOpenApplicants.some(
                (existingApplicant) => existingApplicant.id === applicant.id
              )
          ),
        ];

        setCompanyApplicants({
          companyApplicants: companyLocationOpenApplicants.filter(
            (applicant) => applicant.company_id === vacancyCompanyId
          ),
          locationApplicants: companyLocationOpenApplicants.filter(
            (applicant) => applicant.location_id === vacancyLocationId
          ),
          openViewApplicants: companyLocationOpenApplicants.filter(
            (applicant) => applicant.open_view === true
          ),
          appliedApplicants: allApplicants,
        });
      } catch (err) {
        console.error("Error fetching applicants:", err);
        setCompanyApplicants({
          companyApplicants: [],
          locationApplicants: [],
          openViewApplicants: [],
          appliedApplicants: [],
        });
      }
    }
    // Find the matching vacancy based on vacancy_id
    const vacancy = all_vacancies.find((vacancy) => vacancy.id === vacancy_id);

    if (vacancy) {
      const vacancyLocationId = vacancy.location_id;
      const vacancyCompanyId = vacancy.company_id;

      // Fetch only the applicants who meet the criteria from the database
      fetchApplicants(vacancyLocationId, vacancyCompanyId);
    }
  }, [vacancy_id, all_vacancies]); // Re-run effect if vacancy_id or all_vacancies changes

  // Render applicant card
  const renderApplicantCard = (applicant) => (
    <ApplicantCard
      key={applicant.id}
      className="applicant-card"
      onClick={() => handleApplicantSelect(applicant)}
    >
      <h3>{applicant.full_name}</h3>
      {/* Add more details you want to display about the applicant */}
      <p>{applicant.email}</p>
      {/* Add other details as necessary */}
    </ApplicantCard>
  );

  return (
    <FormWrapper>
      <Title>Applicant Selection</Title>

      {/* Tabs for different applicant groups */}
      <Tabs selectedTab={selectedTab} onTabChange={handleTabChange}>
        <TabList>
          <Tab id="location">Location</Tab>
          <Tab id="company">Company</Tab>
          <Tab id="applied">Applied</Tab>
          <Tab id="openView">Open View</Tab>
        </TabList>

        {/* Tab Panels */}
        <TabPanel id="location" aria-hidden={selectedTab !== "location"}>
          {companyApplicants.locationApplicants.map(renderApplicantCard)}
        </TabPanel>

        <TabPanel id="company" aria-hidden={selectedTab !== "company"}>
          {companyApplicants.companyApplicants.map(renderApplicantCard)}
        </TabPanel>

        <TabPanel id="applied" aria-hidden={selectedTab !== "applied"}>
          {companyApplicants.appliedApplicants.length === 0 ? (
            <EmptyStateMessage>No applicants applied yet.</EmptyStateMessage>
          ) : (
            companyApplicants.appliedApplicants.map(renderApplicantCard)
          )}
        </TabPanel>

        <TabPanel id="openView" aria-hidden={selectedTab !== "openView"}>
          {companyApplicants.openViewApplicants.map(renderApplicantCard)}
        </TabPanel>
      </Tabs>
    </FormWrapper>
  );
}
