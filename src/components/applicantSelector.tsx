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

export default function ApplicantSelector({
  vacancy_id,
  all_vacancies,
  onSelectApplicant,
  selectedApplicant,
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
    async function fetchApplicants(
      vacancy_id: string | null,
      vacancyLocationId: string | null,
      vacancyCompanyId: string | null
    ) {
      try {
        if (!vacancy_id) throw new Error("vacancy_id is required");

        // Step 1: Get IDs of applied users
        const { data: vacancyApplicants, error: vacancyError } = await supabase
          .from("vacancy_applicants")
          .select("user_id")
          .eq("vacancy_id", vacancy_id);

        if (vacancyError) throw vacancyError;
        const appliedUserIds = vacancyApplicants.map((a) => a.user_id);

        // Step 2: Fetch applicants matching location or company
        const orMatchFilters = [];
        let matchedApplicants = [];
        // Only add filters if either vacancyLocationId or vacancyCompanyId is provided
        if (vacancyLocationId) {
          orMatchFilters.push(`location_id.eq.${vacancyLocationId}`);
        }
        if (vacancyCompanyId) {
          orMatchFilters.push(`company_id.eq.${vacancyCompanyId}`);
        }

        // Only make the API call if there is at least one filter
        if (orMatchFilters.length > 0) {
          const { data: matchedApplicantsData, error: matchError } =
            await supabase
              .from("applicant_profiles")
              .select("*")
              .or(orMatchFilters.join(","));

          if (matchError) throw matchError;
          matchedApplicants = matchedApplicantsData || [];
          // Handle matched applicants here (process data as needed)
        } else {
          // Handle case where no location or company ID is provided
          console.log("No location or company ID provided, skipping API call.");
        }

        // Step 3: Fetch open-view applicants who do NOT match location/company
        // Prepare filters based on the provided location and company IDs
        const locationFilter = vacancyLocationId
          ? `location_id.neq.${vacancyLocationId}`
          : "";
        const companyFilter = vacancyCompanyId
          ? `company_id.neq.${vacancyCompanyId}`
          : "";

        // Build the filter string dynamically
        const filters = [locationFilter, companyFilter, "open_view.eq.true"]
          .filter(Boolean)
          .join(",");

        const { data: openViewApplicants, error: openViewError } =
          await supabase.from("applicant_profiles").select("*").or(filters);

        if (openViewError) throw openViewError;

        // Step 4: Fetch applied applicants (if any)
        let appliedApplicants: any[] = [];
        if (appliedUserIds.length > 0) {
          const { data: appliedData, error: appliedError } = await supabase
            .from("applicant_profiles")
            .select("*")
            .in("id", appliedUserIds);

          if (appliedError) throw appliedError;
          appliedApplicants = appliedData || [];
        }

        // Step 5: Bucket applicants
        const locationApplicants = matchedApplicants.filter(
          (a) =>
            a.location_id === vacancyLocationId &&
            !appliedUserIds.includes(a.id)
        );

        const companyApplicants = matchedApplicants.filter(
          (a) =>
            a.company_id === vacancyCompanyId &&
            a.location_id !== vacancyLocationId &&
            !appliedUserIds.includes(a.id)
        );

        // Step 6: Set state
        setCompanyApplicants({
          locationApplicants,
          companyApplicants,
          appliedApplicants,
          openViewApplicants,
        });
      } catch (err) {
        console.error("Error fetching applicants:", err);
        setCompanyApplicants({
          locationApplicants: [],
          companyApplicants: [],
          appliedApplicants: [],
          openViewApplicants: [],
        });
      }
    }

    // Find the matching vacancy based on vacancy_id
    const vacancy = all_vacancies.find((vacancy) => vacancy.id === vacancy_id);

    if (vacancy) {
      const vacancyLocationId = vacancy.location_id || null;
      const vacancyCompanyId = vacancy.company_id || null;

      // Fetch only the applicants who meet the criteria from the database
      fetchApplicants(vacancy_id, vacancyLocationId, vacancyCompanyId);
    }
  }, [vacancy_id, all_vacancies]); // Re-run effect if vacancy_id or all_vacancies changes

  // Render applicant card
  const renderApplicantCard = (applicant) => (
    <ApplicantCard
      key={applicant.id}
      className="applicant-card"
      onClick={() => onSelectApplicant(applicant.user_id)}
      style={
        selectedApplicant === applicant.user_id
          ? { backgroundColor: "pink" }
          : {}
      }
    >
      <h3>{applicant.full_name}</h3>
      <p>{applicant.user_id}</p>
      {/* Add more details you want to display about the applicant */}
      <p>{applicant.email}</p>
      {/* Add other details as necessary */}
    </ApplicantCard>
  );

  return (
    <FormWrapper>
      <Title>Applicant Selection</Title>
      <p>Display "users"</p>
      <p>Display images</p>
      {/* Tabs for different applicant groups */}
      <Tabs>
        <TabList>
          <Tab
            type="button"
            id="location"
            onClick={() => handleTabChange("location")}
            aria-selected={selectedTab === "location"}
          >
            Location
          </Tab>
          <Tab
            type="button"
            id="company"
            onClick={() => handleTabChange("company")}
            aria-selected={selectedTab === "company"}
          >
            Company
          </Tab>
          <Tab
            type="button"
            id="applied"
            onClick={() => handleTabChange("applied")}
            aria-selected={selectedTab === "applied"}
          >
            Applied
          </Tab>
          <Tab
            type="button"
            id="openView"
            onClick={() => handleTabChange("openView")}
            aria-selected={selectedTab === "openView"}
          >
            Open View
          </Tab>
        </TabList>

        {/* Tab Panels */}
        <TabPanel id="location" aria-hidden={selectedTab !== "location"}>
          {companyApplicants.locationApplicants.length === 0 ? (
            <EmptyStateMessage>This location has no workers</EmptyStateMessage>
          ) : (
            companyApplicants.locationApplicants.map(renderApplicantCard)
          )}
        </TabPanel>

        <TabPanel id="company" aria-hidden={selectedTab !== "company"}>
          {companyApplicants.companyApplicants.length === 0 ? (
            <EmptyStateMessage>This company has no workers</EmptyStateMessage>
          ) : (
            companyApplicants.companyApplicants.map(renderApplicantCard)
          )}
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
