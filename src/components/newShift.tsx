"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "superbase";
import DateTimePicker from "@/components/picker";
import { NewShift as NewShiftType, JobType } from "@/types/vacancies";
import { Location as LocationType } from "@/types/location";
import { useUser } from "@/contexts/UserContext";
import { styled } from "@stitches/react";
import { useLocale } from "@/app/[locale]/hooks/useLocal";
import { useTranslation } from "next-i18next";
import ApplicantSelector from "@/components/applicantSelector";
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

export default function NewShift({
  vacancy_id,
  all_vacancies,
  finishAddingShift,
}) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { user } = useUser();
  const [shiftData, setShiftData] = useState<NewShiftType>({
    vacancy_id: vacancy_id,
    applicant_id: "",
    start_time: new Date(),
    end_time: new Date(),
  });
  const currentLocale = useLocale();
  const requiredFields = [
    "job_title",
    "description",
    "type_id",
    // "location_id",
    "job_level",
    "status",
    "employee_places",
  ];
  const [templates, setTemplates] = useState<any[]>([]); // Store templates
  const [showModal, setShowModal] = useState(false); // Control Modal visibility
  const [templateName, setTemplateName] = useState(""); // Template Name
  const isFormValid = requiredFields.every((field) => shiftData[field] !== "");
  const updateData = (key: string, value: any) => {
    const newData = { ...shiftData, [key]: value };
    setShiftData(newData);
  };
  useEffect(() => {
    async function fetchData() {
      const { data: templatesData, error: templatesError } = await supabase
        .from("shift_templates")
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
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setShiftData((prevData) => ({
      ...prevData,
      [name]: value || "", // Default to empty string if no value
    }));
  };
  const handleSaveTemplate = async () => {
    if (!templateName) {
      alert("Template name is required");
      return;
    }

    const { error } = await supabase.from("shift_templates").insert([
      {
        company_id:
          user?.company_id || localStorage.getItem("user")?.company_id,
        name: templateName,
        data: shiftData,
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
    if (shiftData.company_id) delete shiftData.company_id;
    // Ensure all required fields are populated
    if (
      !user ||
      !shiftData.vacancy_id ||
      !shiftData.start_time ||
      !shiftData.end_time
    ) {
      alert("Missing required fields");
      return;
    }

    const { data, error } = await supabase.from("shifts").insert(shiftData);
    finishAddingShift(data);
    if (error) {
      alert("Error creating shift");
      console.error(error);
    } else if (shiftData.type_id === 4) {
      // Gig Work
      router.push(`/${currentLocale}/vacancies/shifts/new`);
    } else {
      router.push(`/${currentLocale}/vacancies/manage`);
    }
  };
  const handleApplicantSelect = (id: string) => {
    // Update the applicant_id in the state
    setShiftData((prevData) => ({
      ...prevData,
      applicant_id: id,
    }));
    console.log(id); // Optionally log the ID
  };
  return (
    <FormWrapper>
      {/* Modal for picking applicants. Location/Company/Applied/Open(invite) */}
      <Title>{t("vacancies.new")}</Title>
      {/* Template Selection Dropdown */}
      Shift Templates
      {templates.length > 0 && (
        <ZoneGreen>
          <Label>{t("generic.select_template")}</Label>
          <Select
            name="template"
            onChange={(e) => {
              const selectedTemplate = templates.find(
                (template) => template.id === Number(e.target.value)
              );
              if (selectedTemplate) {
                setShiftData(selectedTemplate.data);
              }
            }}
          >
            <option value="">{t("generic.select_template")}</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </Select>
        </ZoneGreen>
      )}
      <Form onSubmit={handleSubmit}>
        {Object.keys(shiftData).map((key) => {
          const fieldValue = (shiftData as any)[key];
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
          if (key === "start_time" || key === "end_time") {
            return (
              <DateTimePicker
                key={key}
                value={fieldValue}
                onChange={(newValue) => updateData(key, newValue)}
              />
            );
          } else if (key === "applicant_id") {
            return (
              <div key={key}>
                <ApplicantSelector
                  onSelectApplicant={handleApplicantSelect}
                  vacancy_id={vacancy_id}
                  selectedApplicant={shiftData.applicant_id || ""}
                  all_vacancies={all_vacancies}
                />
              </div>
            );
          } else if (typeof fieldValue === "string") {
            return (
              <InputWrapper key={key}>
                <Label>
                  {t(`vacancies.${key}`, {
                    defaultValue: key.replace("_", " "),
                  })}
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
                  {t(`vacancies.${key}`, {
                    defaultValue: key.replace("_", " "),
                  })}
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
                  {t(`vacancies.${key}`, {
                    defaultValue: key.replace("_", " "),
                  })}
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
        <Button color="blue" type="button" onClick={() => setShowModal(true)}>
          {t("generic.save_template")}
        </Button>
        <Button type="submit" disabled={!isFormValid}>
          {t("vacancies.create")}
        </Button>
      </Form>
      {/* Modal to save template */}
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <h3>{t("generic.save_template")}</h3>
            <Label>{t("generic.template_name")}</Label>
            <Input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button color="red" onClick={() => setShowModal(false)}>
                {t("generic.close")}
              </Button>
              <Button onClick={handleSaveTemplate}>
                {t("generic.save_template")}
              </Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </FormWrapper>
  );
}
