"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "superbase";
import { NewVacancy as NewVacancyType, JobType } from "@/types/vacancies";
import { Location as LocationType } from "@/types/location";
import { useUser } from "@/contexts/UserContext";
import { styled } from "@stitches/react";
import { useLocale } from "@/app/[locale]/hooks/useLocal";
import {
  Button,
  Title,
  Form,
  Input,
  Label,
  Select,
  ZoneGreen,
} from "@/styles/basic";

const FormWrapper = styled("div", {
  margin: "0 auto",
  padding: "2rem",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
});

const TextArea = styled("textarea", {
  width: "100%",
  padding: "0.75rem",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "16px",
  resize: "vertical",
});

const InputWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
});

const Checkbox = styled("input", {
  marginTop: "8px",
});

const RequiredStar = styled("span", {
  color: "red",
  fontWeight: "bold",
});

// Modal Styles
const ModalOverlay = styled("div", {
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  background: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
});

const ModalContent = styled("div", {
  backgroundColor: "WhiteSmoke",
  color: "Black",
  padding: "2rem",
  borderRadius: "8px",
  width: "400px",
  maxWidth: "90%",
});
export default function NewVacancy() {
  const router = useRouter();
  const { user } = useUser();
  const [vacancyData, setVacancyData] = useState<NewVacancyType>({
    company_id:
      user?.company_id || localStorage.getItem("user")?.company_id || "", // fallback to empty string
    type_id: null, // full-time, part-time
    location_id: null,
    job_title: "", // required
    description: "", // required
    special_instructions: "",
    currency_id: null,
    hourly_rate: NaN,
    day_salary: NaN,
    month_salary: NaN,
    yearly_salary: NaN,
    status: "active", // required
    job_level: 1, // required
    approved_datetime: null,
    approved_by: null,
    created_by: user?.id,
    updated_by: user?.id,
    employee_places: 1, // optional
    start_date: null,
    end_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // vacancy_applicants: [],
    // vacancy_skills: [],
    // vacancy_languages: [],
    // vacancy_certifications: [],
    // vacancy_managers: [],
    country_id: null,
    // work_address: "",
  });
  const currentLocale = useLocale();
  const requiredFields = ["job_title", "description"];
  const [templates, setTemplates] = useState<any[]>([]); // Store templates
  const [showModal, setShowModal] = useState(false); // Control Modal visibility
  const [templateName, setTemplateName] = useState(""); // Template Name
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [payType, setPayType] = useState<string[]>([]); // hourly, monthly
  const [countries, setCountries] = useState<string[]>([]);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [locations, setLocations] = useState<LocationType[]>([]);
  const isFormValid = requiredFields.every(
    (field) => vacancyData[field] !== ""
  );
  const job_level = [
    { id: 1, name: "public" },
    { id: 2, name: "company" },
    { id: 3, name: "location" },
  ];

  const job_status = [
    { id: 1, name: "active" },
    { id: 2, name: "draft" },
  ];

  useEffect(() => {
    async function fetchData() {
      // Fetch job types
      const { data: jobTypes, error: jobTypeError } = await supabase
        .from("job_types")
        .select("*");
      if (jobTypeError) {
        console.error(jobTypeError);
      }
      setJobTypes(jobTypes || []);

      // Fetch locations
      const { data: locations, error: locationError } = await supabase
        .from("locations")
        .select("*");
      if (locationError) {
        console.error(locationError);
      }
      setLocations(locations || []);

      //   fetch countries
      // fetch currencies

      // Fetch vacancy templates based on company_id
      const { data: templatesData, error: templatesError } = await supabase
        .from("vacancy_templates")
        .select("*")
        .eq(
          "company_id",
          user?.company_id || localStorage.getItem("user")?.company_id
        );
      if (templatesError) console.error(templatesError);
      setTemplates(templatesData || []);
    }
    fetchData();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setVacancyData((prevData) => ({
      ...prevData,
      [name]: value || "", // Default to empty string if no value
    }));
  };
  const handleSaveTemplate = async () => {
    if (!templateName) {
      alert("Template name is required");
      return;
    }

    const { error } = await supabase.from("vacancy_templates").insert([
      {
        company_id:
          user?.company_id || localStorage.getItem("user")?.company_id,
        name: templateName,
        data: vacancyData,
      },
    ]);

    if (error) {
      alert("Error saving template");
      console.error(error);
    } else {
      setShowModal(false);
      alert("Template saved successfully");
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    vacancyData.company_id = user?.company_id || "";
    // Ensure all required fields are populated
    if (
      !user ||
      !vacancyData.company_id ||
      !vacancyData.job_title ||
      !vacancyData.description
    ) {
      alert("Missing required fields");
      return;
    }

    const { data, error } = await supabase
      .from("vacancies")
      .insert([vacancyData]);

    if (error) {
      alert("Error creating vacancy");
      console.error(error);
    } else {
      router.push(`/${currentLocale}/vacancies/manage`);
    }
  };

  return (
    <FormWrapper>
      <Title>Create New Vacancy</Title>
      {/* Template Selection Dropdown */}
      {templates.length > 0 && (
        <ZoneGreen>
          <Label>Select Template</Label>
          <Select
            name="template"
            onChange={(e) => {
              const selectedTemplate = templates.find(
                (template) => template.id === Number(e.target.value)
              );
              if (selectedTemplate) {
                setVacancyData(selectedTemplate.data);
              }
            }}
          >
            <option value="">Select Template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </Select>
        </ZoneGreen>
      )}
      <Form onSubmit={handleSubmit}>
        {Object.keys(vacancyData).map((key) => {
          const fieldValue = (vacancyData as any)[key];
          if (
            [
              "company_id",
              "created_by",
              "updated_by",
              "created_at",
              "updated_at",
            ].includes(key)
          )
            return null; // Skip these fields

          const isRequired = requiredFields.includes(key);
          if (key === "type_id") {
            {
              /* Job Type */
            }
            return (
              <div key={key}>
                <Label>Job Type</Label>
                {isRequired && <RequiredStar>*</RequiredStar>}
                <Select
                  name="type_id"
                  value={vacancyData.type_id}
                  onChange={handleChange}
                >
                  <option value="">Select Job Type</option>
                  {jobTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Select>
              </div>
            );
          } else if (key === "location_id") {
            {
              /* Location */
            }
            return (
              <div key={key}>
                <Label>Location</Label>
                {isRequired && <RequiredStar>*</RequiredStar>}
                <Select
                  name="location_id"
                  value={vacancyData.location_id}
                  onChange={handleChange}
                >
                  <option value="">Select Location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </Select>
              </div>
            );
          } else if (key === "job_title") {
            {
              /* Job Title */
            }
            return (
              <div key={key}>
                <Label>Job Title</Label>
                {isRequired && <RequiredStar>*</RequiredStar>}
                <Input
                  type="text"
                  name="job_title"
                  value={vacancyData.job_title}
                  onChange={handleChange}
                />
              </div>
            );
          } else if (key === "description") {
            {
              /* Description */
            }
            return (
              <div key={key}>
                <Label>Description</Label>
                {isRequired && <RequiredStar>*</RequiredStar>}
                <TextArea
                  name="description"
                  value={vacancyData.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            );
          } else if (key === "job_level") {
            return (
              <div key={key}>
                <Label>Job Level</Label>
                {isRequired && <RequiredStar>*</RequiredStar>}
                <Select
                  name="job_level"
                  value={vacancyData.job_level || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Job Level</option>
                  {job_level.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </Select>
              </div>
            );
          } else if (key === "status") {
            {
              /* Status */
            }
            return (
              <div key={key}>
                <Label>Status</Label>
                {isRequired && <RequiredStar>*</RequiredStar>}
                <Select
                  name="status"
                  value={vacancyData.status}
                  onChange={handleChange}
                >
                  {job_status.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </Select>
              </div>
            );
          } else if (key === "country_id") {
            return (
              <InputWrapper key={key}>
                <Label>
                  Country
                  {isRequired && <RequiredStar>*</RequiredStar>}
                </Label>
                <Select
                  name={key}
                  value={fieldValue}
                  onChange={handleChange}
                  required={isRequired}
                >
                  <option value="">Select Country</option>
                  {countries.map((status) => (
                    <option key={key} value={status}>
                      {status ? "Active" : "Inactive"}
                    </option>
                  ))}
                </Select>
              </InputWrapper>
            );
          } else if (key === "currency_id") {
            return (
              <InputWrapper key={key}>
                <Label>
                  Currency
                  {isRequired && <RequiredStar>*</RequiredStar>}
                </Label>
                <Select
                  name={key}
                  value={fieldValue}
                  onChange={handleChange}
                  required={isRequired}
                >
                  <option value="">Select Currency</option>
                  {currencies.map((status) => (
                    <option key={key} value={status}>
                      {status ? "Active" : "Inactive"}
                    </option>
                  ))}
                </Select>
              </InputWrapper>
            );
          } else if (typeof fieldValue === "string") {
            return (
              <InputWrapper key={key}>
                <Label>
                  {key.replace("_", " ")}
                  {isRequired && <RequiredStar>*</RequiredStar>}
                </Label>
                <Input
                  type="text"
                  name={key}
                  value={fieldValue}
                  onChange={handleChange}
                  required={isRequired}
                  placeholder={key.replace("_", " ")}
                />
              </InputWrapper>
            );
          } else if (typeof fieldValue === "number") {
            return (
              <InputWrapper key={key}>
                <Label>
                  {key.replace("_", " ")}
                  {isRequired && <RequiredStar>*</RequiredStar>}
                </Label>
                <Input
                  type="number"
                  name={key}
                  value={fieldValue || ""}
                  onChange={handleChange}
                  required={isRequired}
                  placeholder={key.replace("_", " ")}
                />
              </InputWrapper>
            );
          } else if (typeof fieldValue === "boolean") {
            return (
              <InputWrapper key={key}>
                <Label>
                  {key.replace("_", " ")}
                  {isRequired && <RequiredStar>*</RequiredStar>}
                </Label>
                <Checkbox
                  type="checkbox"
                  name={key}
                  checked={fieldValue}
                  onChange={handleChange}
                  required={isRequired}
                />
              </InputWrapper>
            );
          }
          return null;
        })}
        {/* Save as Template Button */}
        <Button color="blue" type="button" onClick={() => setShowModal(true)}>
          Save as Template
        </Button>
        <Button type="submit" disabled={!isFormValid}>
          Create Vacancy
        </Button>
      </Form>
      {/* Modal to save template */}
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <h3>Save as Template</h3>
            <Label>Template Name</Label>
            <Input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button color="red" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button onClick={handleSaveTemplate}>Save Template</Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </FormWrapper>
  );
}
