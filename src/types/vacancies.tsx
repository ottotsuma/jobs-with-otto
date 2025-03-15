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

            // Date start
        // Date end
        // Shifts, so you can select the days, like 1 = monday - wensday, 2 = Monday - Friday. Different times, different number of Employee_places. But everything else about the job is the same.
        // Employee_places 
        // Assign
                // managers []
        // Required Certification

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
