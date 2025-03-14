export type CompanyReview = {
    id: number;
    company_id: string; // UUID as string
    applicant_id: string; // UUID as string
    rating: number;
    review: string;
    created_at: string; // Timestamp ISO string
};

export type Company = {
    id: string; // UUID as string
    name: string;
    address: string;
    industry: string;
    company_logo_filename: string;
    company_description: string;
    registration_no: string;
    company_type: string;
    company_url: string;
    company_email: string;
    company_contact_number: string;
    status: boolean;
    created_by: string; // UUID as string
    updated_by: string; // UUID as string
    company_website: string;
    company_logo_url: string;
    company_culture: string;
    average_rating: number; // Average rating value
};

export type newCompany = Omit<Company, "id" | "average_rating" | "updated_by" | "created_by" | "status"> & {
};
