"use client";
import { useState, useEffect } from "react";
import Table from "@/components/Table";
// import { supabase } from "superbase";
// import { ApplicantProfile, ManagerProfile, AdminProfile } from '@/types/users';
import Loading from "@/components/loading";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { Company, company_bannedEdit } from "@/types/company";
// import { Location } from '@/types/location';
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
import { supabase } from "superbase";
import ProtectedRoute from "@/contexts/ProtectedRoute.js";
import { useTitle } from "@/contexts/TitleContext";
import { useLocale } from "@/app/[locale]/hooks/useLocal";
import { company_manager_banned_edit } from "@/types/users";
export default function ProfilePage() {
  const router = useRouter();
  const { user } = useUser();
  const currentLocale = useLocale();
  const [company, setCompany] = useState<Company | null>(null);
  const [companyManagers, setCompanyManagers] = useState([]);
  const [companyApplicants, setCompanyApplicants] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { setTitle } = useTitle();
  const [applications, setApplications] = useState([]);
  const [worker_applications, setWorkerApplications] = useState([]);

  async function fetchApplications(companyId: string) {
    const { data, error } = await supabase
      .from("company_manager_applications")
      .select("*")
      .eq("company_id", companyId);

    if (error) {
      console.error("Error fetching applications:", error);
    } else {
      setApplications(data);
    }
  }
  async function fetchWorkerApplications(companyId: string) {
    const { data, error } = await supabase
      .from("company_applicant_applications")
      .select("*")
      .eq("company_id", companyId);

    if (error) {
      console.error("Error fetching applications:", error);
    } else {
      setWorkerApplications(data);
    }
  }
  const blockedValues = ["id", "user_id", "created_at", "updated_at"];
  useEffect(() => {
    setTitle("Manage Company");
  }, []);

  useEffect(() => {
    async function fetchCompany(companyId: number) {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", companyId)
        .single();
      if (!error) setCompany(data);
      setLoading(false);
    }
    async function fetchCompanyManagers(companyId: number) {
      const { data, error } = await supabase
        .from("manager_profiles")
        .select("*")
        .eq("company_id", companyId);
      if (!error) setCompanyManagers(data);
    }
    async function fetchCompanyApplicants(companyId: number) {
      const { data, error } = await supabase
        .from("applicant_profiles")
        .select("*")
        .eq("company_id", companyId);
      if (!error) setCompanyApplicants(data);
    }
    fetchCompany(user?.company_id || localStorage.getItem("user")?.company_id);
    fetchCompanyManagers(user?.company_id);
    fetchApplications(user?.company_id);
    fetchWorkerApplications(user?.company_id);
  }, [user]);
  async function updateCompany(e) {
    e.preventDefault();
    if (!company) return;
    const { error } = await supabase
      .from("companies")
      .update(company)
      .eq("id", company.id);
    if (error) {
      console.error("Update error:", error);
    } else {
      alert("Company updated successfully");
    }
  }

  async function deleteCompany() {
    if (!company) return;
    const confirmDelete = confirm(
      "Are you sure you want to delete this company?"
    );
    if (!confirmDelete) return;
    const { error } = await supabase
      .from("companies")
      .delete()
      .eq("id", company.id);
    if (error) {
      console.error("Delete error:", error);
    } else {
      alert("Company deleted successfully");
      router.push(`${currentLocale}/`);
    }
  }
  const statusOptions = ["Active", "Inactive"];
  function handleManagersChange() {}
  function removeManager() {}
  function handleApplicantsChange() {}
  function removeApplicant() {}
  return (
    <ProtectedRoute allowedRoles={["admin", "manager", "applicant"]}>
      {!loading && company ? (
        <Container>
          <Title>{company.name}</Title>
          <>
            <ZoneGreen>
              <Form onSubmit={updateCompany}>
                {Object.entries(company)
                  .filter(([key]) => !blockedValues.includes(key))
                  .map(([key, value]) =>
                    key === "status" ? (
                      <Select
                        key={key}
                        value={value as string}
                        onChange={(e) =>
                          setCompany({ ...company, [key]: e.target.value })
                        }
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Select>
                    ) : key === "company_type" ? (
                      <Select
                        id={key}
                        name={key}
                        value={value}
                        onChange={(e) =>
                          setCompany({ ...company, [key]: e.target.value })
                        }
                      >
                        <option value="Private">Private</option>
                        <option value="Public">Public</option>
                        <option value="Non-Profit">Non-Profit</option>
                      </Select>
                    ) : company_bannedEdit.includes(key) ? (
                      value ? (
                        <div key={key}>
                          <Label>{key}</Label>
                          <div>{value || ""}</div>
                        </div>
                      ) : null
                    ) : (
                      <div key={key}>
                        <Label>{key}</Label>
                        <Input
                          type="text"
                          value={value || ""}
                          onChange={(e) =>
                            setCompany({ ...company, [key]: e.target.value })
                          }
                        />
                      </div>
                    )
                  )}
                <Button type="submit" color="green">
                  Update Company
                </Button>
              </Form>
            </ZoneGreen>
            <ZoneGreen>
              <h1>Company Managers:</h1>
              {companyManagers.length > 0 ? (
                <Table
                  data={companyManagers}
                  onDataChange={handleManagersChange}
                  deleteRow={removeManager}
                  bannedEdit={company_manager_banned_edit}
                />
              ) : (
                <p>None Found</p>
              )}
              <h1 style={{ marginTop: "15px" }}>Company Applicants:</h1>
              {companyApplicants.length > 0 ? (
                <Table
                  data={companyApplicants}
                  onDataChange={handleApplicantsChange}
                  deleteRow={removeApplicant}
                  bannedEdit={company_manager_banned_edit}
                />
              ) : (
                <p>None Found</p>
              )}
            </ZoneGreen>
            {/* Yellow Zone - Change Password & Role Update Forms */}
            <ZoneYellow>
              <p>Permissions</p>
              {applications.length > 0 && (
                <>
                  <h3>Manager Applications</h3>
                  <Table
                    data={applications}
                    onDataChange={() => {}}
                    deleteRow={() => {}}
                    bannedEdit={[]}
                    actions={[
                      {
                        name: "accept",
                        function: () => {},
                        icon: "✅",
                      },
                      {
                        name: "reject",
                        function: () => {},
                        icon: "❌",
                      },
                    ]}
                  />
                </>
              )}
              {worker_applications.length > 0 && (
                <>
                  <h3>Worker Applications</h3>
                  <Table
                    data={applications}
                    onDataChange={() => {}}
                    deleteRow={() => {}}
                    bannedEdit={[]}
                  />
                </>
              )}
              {/* <div>{applications}</div> */}
            </ZoneYellow>
            {/* applications */}
            {/* Red Zone - Delete Profile */}
            <ZoneRed>
              <Button onClick={deleteCompany} color="red">
                Delete Company (needs warning popup)
              </Button>
            </ZoneRed>
          </>
        </Container>
      ) : (
        <Loading />
      )}
    </ProtectedRoute>
  );
}
