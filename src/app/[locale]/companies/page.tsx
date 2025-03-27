"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/app/[locale]/hooks/useLocal";
import Logo from "@/components/logo";
import { supabase } from "superbase";
import { styled } from "@stitches/react";
import { Container, Title } from "@/styles/basic";
import { Company } from "@/types/company";
import { useTitle } from "@/contexts/TitleContext";
import SideBar from "@/components/Sidebar";
import ViewCompany from "@/components/viewCompany";

// Mapping of industries to card background colors and emoji's
const industryStyles: Record<string, { color: string; emoji: string }> = {
  Technology: { color: "#4f46e5", emoji: "💻" },
  Finance: { color: "#10b981", emoji: "💰" },
  Healthcare: { color: "#ef4444", emoji: "🏥" },
  Education: { color: "#facc15", emoji: "📚" },
  Retail: { color: "#3b82f6", emoji: "🛒" },
  // You can add more industries here...
};

const Grid = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "16px",
});

const Card = styled(Link, {
  display: "block",
  padding: "16px",
  borderRadius: "12px",
  textDecoration: "none",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
  },
});
const CardButton = styled("button", {
  display: "block",
  padding: "16px",
  borderRadius: "12px",
  textDecoration: "none",
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

export default function CompaniesPage() {
  // const currentLocale = useLocale();
  const [companies, setCompanies] = useState<Company[]>([]);
  const { setTitle } = useTitle();

  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const handleCompanySelected = (company_id: string) => {
    if (company_id) {
      setSelectedCompany(company_id);
      setCompanyModalOpen(true);
    }
  };

  useEffect(() => {
    setTitle("Companies");
    async function fetchCompanies() {
      const { data, error } = await supabase.from("companies").select("*");
      if (!error) setCompanies(data);
    }
    fetchCompanies();
  }, []);

  return (
    <Container>
      <SideBar
        isOpen={companyModalOpen && !!selectedCompany}
        onClose={() => setCompanyModalOpen(false)}
      >
        <ViewCompany company_id={selectedCompany} />
      </SideBar>
      <Title>Companies</Title>
      <Grid>
        {companies.map((company) => {
          // Determine the industry style. Default to white background if not found.
          const industryStyle = industryStyles[company.industry];
          const backgroundColor = industryStyle
            ? industryStyle.color
            : "#ffffff";
          // Use white text for colored backgrounds, black for white background.
          const textColor = backgroundColor === "#ffffff" ? "black" : "white";

          return (
            <CardButton
              key={company.id}
              // href={`companies/${company.id}`}
              onClick={() => {
                handleCompanySelected(company.id);
              }}
              style={{ backgroundColor, color: textColor }}
            >
              {company.company_logo_url && (
                <Logo
                  src={company.company_logo_url}
                  alt={`${company.name} logo`}
                />
              )}
              <CardTitle>{company.name}</CardTitle>
              <CardDetails>⭐ {company.average_rating || 0}</CardDetails>
              <DetailRow>
                {/* <strong>Type:</strong> {company.company_type} */}
              </DetailRow>
              {company.industry && (
                <DetailRow>
                  <strong>Industry:</strong>{" "}
                  {industryStyle
                    ? `${industryStyle.emoji} ${company.industry}`
                    : company.industry}
                </DetailRow>
              )}
              {company.foundedDate && (
                <DetailRow>
                  <strong>Founded:</strong> {company.foundedDate}
                </DetailRow>
              )}
              {company.companySize && (
                <DetailRow>
                  <strong>Size:</strong> {company.companySize}
                </DetailRow>
              )}
              {company.tags && company.tags.length > 0 && (
                <DetailRow>
                  <strong>Tags:</strong>{" "}
                  {company.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "#6b7280",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        marginRight: "4px",
                        fontSize: "12px",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </DetailRow>
              )}
            </CardButton>
          );
        })}
      </Grid>
    </Container>
  );
}
