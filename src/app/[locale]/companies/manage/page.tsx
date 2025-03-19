"use client";
import { useState, useEffect } from "react";
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

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useUser();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const blockedValues = ["id", "user_id", "created_at", "updated_at"];

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
    fetchCompany(user?.company_id || localStorage.getItem("user")?.company_id);
  }, [user]);
  async function updateCompany(e) {
    e.preventDefault();
  }
  async function deleteCompany(e) {
    e.preventDefault();
  }
  const statusOptions = ["Active", "Inactive"];

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

            {/* Yellow Zone - Change Password & Role Update Forms */}
            <ZoneYellow>Permissions</ZoneYellow>

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
      <footer>
        <Button onClick={() => router.push("/about")} color="blue">
          about
        </Button>
        <Button onClick={() => router.push("/contact")} color="blue">
          contact
        </Button>
      </footer>
    </ProtectedRoute>
  );
}
