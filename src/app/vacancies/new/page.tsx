'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "superbase";
import { NewVacancy as NewVacancyType, JobType } from "@/types/vacancies";
import {User as UserType} from "@/types/users";
import {Location as LocationType} from "@/types/location";
import { useUser } from '@/contexts/UserContext';
export default function NewVacancy() {
    const router = useRouter();
    const { user } = useUser();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [salary, setSalary] = useState<string>("");
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [jobTypes, setJobTypes] = useState<JobType[]>([]); // Replace with actual type if possible
    const [locations, setLocations] = useState<LocationType[]>([]); // Replace with actual type if possible
    const [typeId, setTypeId] = useState<number>(NaN); // String for type id
    const [locationId, setLocationId] = useState<number>(NaN); // String for location id

    useEffect(() => {
        async function fetchData() {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) return;

            // Fetch job types
            const { data: jobTypes, error: jobTypeError } = await supabase.from("job_types").select("*");
            if (jobTypeError) {
                console.error(jobTypeError);
            }
            setJobTypes(jobTypes || []);

            // Fetch locations
            const { data: locations, error: locationError } = await supabase.from("locations").select("*");
            if (locationError) {
                console.error(locationError);
            }
            setLocations(locations || []);

            // Get manager's company
            const { data: managerProfile, error: profileError } = await supabase
                .from("manager_profiles")
                .select("company_id")
                .eq("user_id", user?.id)
                .single();

            if (profileError) {
                console.error(profileError);
            }
            if (managerProfile) setCompanyId(managerProfile.company_id);
        }

        fetchData();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!user || !companyId) {
            alert("Unauthorized");
            return;
        }

        const vacancyData: NewVacancyType = {
            job_title: title,
            description,
            company_id: companyId,
            type_id: typeId || NaN, // Use null if no type selected
            location_id: locationId || NaN, // Use null if no location selected
            hourly_rate: salary ? parseFloat(salary) : NaN, // Use null if salary not provided
            day_salary: NaN, // You can add this field if needed
            month_salary: NaN, // You can add this field if needed
            yearly_salary: NaN, // You can add this field if needed
            special_instructions: "", // Add logic for special instructions if needed
            created_by: user.id,
            updated_by: user.id, // Assuming it's the same as created_by
            status: "active", // Set the default status or let the user provide it
            approved_datetime: null,
            approved_by: null,
            job_level: 1, // Add job level logic if needed
        };

        const { data, error } = await supabase.from("vacancies").insert([vacancyData]);

        if (error) {
            alert("Error creating vacancy");
            console.error(error);
        } else {
            router.push("/vacancies");
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Create New Vacancy</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Job Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <textarea
                    placeholder="Job Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="Hourly Salary"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <select
                    value={typeId}
                    onChange={(e) => setTypeId(e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Select Job Type</option>
                    {jobTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </select>
                <select
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Select Location (Optional)</option>
                    {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                            {location.name}
                        </option>
                    ))}
                </select>
                <button type="submit" className="bg-blue-600 text-white p-2 rounded">
                    Create Vacancy
                </button>
            </form>
        </div>
    );
}
