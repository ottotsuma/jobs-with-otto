export type User = {
    id: string; // UUID as string
    email: string;
    full_name?: string;
    contact_number?: string;
    created_at: string; // Timestamp ISO string
    updated_at: string; // Timestamp ISO string
};
export type ManagerProfile = Omit<User, ""> & {
    company_id: string; // UUID as string
    job_position: string;
    location_ids: number[]; // Array of location IDs
};
export type ApplicantProfile = Omit<User, ""> & {
    bio: string;
    resume_url?: string;
    skills: string[]; // Array of skill names
    experience: Record<string, unknown>; // Experience details as JSON
};
export type AdminProfile = Omit<User, 'contact_number'> & {
    role: string; // Role of the admin (e.g., Super Admin, Admin)
};
export type UserRole = {
    user_id: string; // UUID as string
    role_id: number; // Role ID
};
