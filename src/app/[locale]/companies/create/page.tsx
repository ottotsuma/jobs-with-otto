"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "superbase";
import { newCompany } from "@/types/company";
import { updateRole } from "@/utils/user";
import { useUser } from "@/contexts/UserContext";
import {
  Button,
  Container,
  Title,
  Form,
  Input,
  Label,
  Select,
} from "@/styles/basic";
import { useLocale } from "@/app/[locale]/hooks/useLocal";
const CreateCompanyPage: React.FC = () => {
  const { user, setUser } = useUser();
  const currentLocale = useLocale();
  const [company, setCompany] = useState<newCompany>({
    name: "",
    address: "",
    industry: "",
    // company_logo_filename: '',
    company_description: "",
    registration_no: "",
    company_type: "Private",
    company_url: "",
    company_email: "",
    company_contact_number: "",
    company_website: "",
    company_logo_url: "",
    company_culture: "",
    created_by: user?.id || "",
    updated_by: user?.id || "",
  });
  const blockedValues = [
    "id",
    "user_id",
    "created_at",
    "updated_at",
    "updated_by",
    "created_by",
  ];

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target;
    setCompany((prevCompany) => ({
      ...prevCompany,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Insert new company
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .insert([company])
      .select("id")
      .single();

    if (companyError) {
      console.error("Error creating company:", companyError);
      return;
    }

    const companyId = companyData?.id;
    if (!companyId) {
      console.error("Failed to retrieve new company ID");
      return;
    }
    // make sure the user has a management role
    updateRole("manager", user, setUser);

    // Insert manager profile linking user to new company
    const { error: profileError } = await supabase
      .from("manager_profiles")
      .update({ company_id: companyId })
      .eq("user_id", user?.id);

    if (profileError) {
      console.error("Error updating manager profile:", profileError);
    }
    router.push(`/${currentLocale}/companies/manage`);
  };

  return (
    <Container>
      <Title>Create Company</Title>
      <Form onSubmit={handleSubmit}>
        {(Object.keys(company) as (keyof newCompany)[]).map((key) => {
          const value = company[key];
          if (blockedValues.includes(key)) return;
          return (
            <div key={key}>
              <Label htmlFor={key}>
                {key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                :
              </Label>
              {typeof value === "string" && key === "name" ? (
                <Input
                  type="text"
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  required
                />
              ) : typeof value === "string" && key === "company_description" ? (
                <Input
                  as="textarea"
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleChange}
                />
              ) : typeof value === "string" && key === "company_type" ? (
                <Select
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleChange}
                >
                  <option value="Private">Private</option>
                  <option value="Public">Public</option>
                  <option value="Non-Profit">Non-Profit</option>
                </Select>
              ) : typeof value === "boolean" ? (
                <Input
                  type="checkbox"
                  id={key}
                  name={key}
                  checked={value}
                  onChange={handleChange}
                />
              ) : typeof value === "number" ? (
                <Input
                  type="number"
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleChange}
                />
              ) : (
                <Input
                  type="text"
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleChange}
                />
              )}
            </div>
          );
        })}
        <Button type="submit">Create Company</Button>
      </Form>
    </Container>
  );
};

export default CreateCompanyPage;
