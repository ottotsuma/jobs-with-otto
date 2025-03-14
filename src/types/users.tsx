export type User = {
    id: string; // UUID as string
    email: string;
    full_name?: string;
    contact_number?: string;
    created_at: string; // Timestamp ISO string
    updated_at: string; // Timestamp ISO string

    profileData?: ManagerProfile | ApplicantProfile | AdminProfile;
};
export type ApplicantProfile = Omit<User, ""> & {
    bio: string;
    resume_url?: string;
    skills: string[]; // Array of skill names
    experience: Record<string, unknown>; // Experience details as JSON
};
export type ManagerProfile = Omit<ApplicantProfile, ""> & {
    company_id: string;
    job_position: string;
    location_ids: number[];
};
export type AdminProfile = Omit<
  ManagerProfile,
  'contact_number' | 'company_id' | 'job_posistion' | 'locatin_ids'
> & {};
export type UserRole = {
    user_id: string; 
    role_id: number; 
};
export type Role = "manager" | "applicant" | "admin" | "authenticated" |"anon";