export type Vacancy = {
  id: number;
  job_title: string;
  type_id: number;
  location_id: number;
  description: string;
  hourly_rate: number;
  day_salary: number;
  month_salary: number;
  yearly_salary: number;
  special_instructions: string;
  company_id: string; // UUID as string
  approved_datetime: string | null; // Timestamp as ISO string or null
  approved_by: string | null; // UUID as string or null
  job_level: number;
  created_by: string; // UUID as string
  updated_by: string; // UUID as string
  status: string;
  employee_places: number; // Number of positions available
  start_date: string; // Date when the vacancy opens
  end_date: string; // Date when the vacancy closes
  updated_at: string;
  created_at: string;
  // Foreign key relations to other tables (optional but related entities)
  vacancy_applicants?: {
    user_id: string; // Foreign key to users.id
    application_status: "pending" | "approved" | "rejected"; // Enum or string type for application status
  }[];

  vacancy_skills?: {
    skill_id: number; // Foreign key to skills.id
  }[];

  vacancy_languages?: {
    language_id: number; // Foreign key to languages.id
  }[];

  vacancy_certifications?: {
    certificate_id: number; // Foreign key to certificates.id
  }[];

  vacancy_managers?: {
    user_id: string; // Foreign key to users.id (managers overseeing the vacancy)
  }[];
  currency_id: number | null;
  country_id: number | null;
  work_address?: string;
  // Manager clock in time
  // applicant clock in time
  // admin clock in time
};

export type NewVacancy = Omit<Vacancy, "id">;

export type JobType = {
  id: number;
  name: string;
};

export type VacancyManager = {
  vacancy_id: number;
  user_id: string; // UUID as string
};

export type VacancyCertificate = {
  vacancy_id: number;
  certificate_id: number;
};

export type VacancyApplicant = {
  vacancy_id: number;
  user_id: string; // UUID as string
  application_status: string;
};
