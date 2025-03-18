"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "superbase";
import { NewLocationType } from "@/types/location";
import { useUser } from "@/contexts/UserContext";
import { styled } from "@stitches/react";

// Stitches styling
const FormContainer = styled("div", {
  // maxWidth: "800px",
  margin: "auto",
  padding: "16px",
});

const Title = styled("h1", {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "16px",
});

const Form = styled("form", {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const InputWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
});

const Label = styled("label", {
  marginBottom: "8px",
  fontSize: "16px",
});

const Input = styled("input", {
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "14px",
  "&:focus": {
    borderColor: "#007bff",
  },
});

const Select = styled("select", {
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "14px",
  "&:focus": {
    borderColor: "#007bff",
  },
});

const Checkbox = styled("input", {
  marginTop: "8px",
});

const Button = styled("button", {
  backgroundColor: "#007bff",
  color: "white",
  padding: "10px 20px",
  borderRadius: "4px",
  cursor: "pointer",
  border: "none",
  fontSize: "16px",
  "&:disabled": {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
});

const RequiredStar = styled("span", {
  color: "red",
  fontWeight: "bold",
});

export default function NewLocation() {
  const router = useRouter();
  const { user } = useUser();
  const [location, setLocation] = useState<NewLocationType>({
    // Basic information
    name: "", // required
    location_type_id: "0dfe382d-5f71-475b-9a64-f59ad447681c", // UUID type
    // Location
    address: "",
    region: "",
    city: "",
    district: "",
    postal_code: "",
    latitude: 0,
    longitude: 0,
    location_qr: "",
    country: "",
    geolocation: {
      type: "Point",
      coordinates: [0, 0], // [longitude, latitude]
    }, // Point type

    // Times
    time_zone: "",
    opening_hours: "",

    // Contact
    contact_email: "",
    contact_phone: "",

    // Settings
    status: true, // required
    requires_geolock: false,
    job_approval_required: false,
    create_template_only: false,

    // Unseen
    // created_at: now(), // Timestamp with timezone
    // updated_at: "", // Timestamp with timezone
    created_by: user?.id, // UUID type // required
    // updated_by: user?.id, // UUID type // required
    company_id: user?.company_id || "", // required
  });

  const requiredFields = [
    "name",
    // "company_id",
    "status",
    // "created_by",
    // "updated_by",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setLocation((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.company_id) {
      alert("Unauthorized");
      return;
    }

    const { data, error } = await supabase.from("locations").insert([location]);

    if (error) {
      alert("Error creating location");
      console.error(error);
    } else {
      router.push("/locations/manage");
    }
  };

  // Check if any required field is empty
  const isFormValid = requiredFields.every((field) => location[field] !== "");

  return (
    <FormContainer>
      <Title>Create New Location</Title>
      <Form onSubmit={handleSubmit}>
        {Object.keys(location).map((key) => {
          const fieldValue = (location as any)[key];
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

          if (key === "status") {
            return (
              <InputWrapper key={key}>
                <Label>
                  Status
                  {isRequired && <RequiredStar>*</RequiredStar>}
                </Label>
                <Select
                  name={key}
                  value={fieldValue}
                  onChange={handleChange}
                  required={isRequired}
                >
                  <option value="">Select Status</option>
                  {[true, false].map((status) => (
                    <option key={status ? "open" : "closed"} value={status}>
                      {status ? "Open" : "Closed"}
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

        <Button type="submit" disabled={!isFormValid}>
          Create Location
        </Button>
      </Form>
    </FormContainer>
  );
}
