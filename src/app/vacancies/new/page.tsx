'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "superbase";
import { NewVacancy as NewVacancyType, JobType } from "@/types/vacancies";
import { Location as LocationType } from "@/types/location";
import { useUser } from '@/contexts/UserContext';

export default function NewVacancy() {
    const router = useRouter();
    const { user } = useUser();
    const [vacancyData, setVacancyData] = useState<NewVacancyType>({
        company_id: "",
        type_id: NaN,
        location_id: NaN,

        job_title: "",
        description: "",
        special_instructions: "",

        hourly_rate: NaN,
        day_salary: NaN,
        month_salary: NaN,
        yearly_salary: NaN,

        status: "active",
        job_level: 1,

        approved_datetime: null,
        approved_by: null,
        created_by: "",
        updated_by: "",
    });
    const [jobTypes, setJobTypes] = useState<JobType[]>([]);
    const [locations, setLocations] = useState<LocationType[]>([]); 
    const job_level = [
        {
            id: 1,
            name: "public"
        },
        {
            id: 2,
            name: "company"
        },
        {
            id: 3,
            name: "location"
        },
    ]
    const job_status = [
        {
            id: 1,
            name: "active"
        },
        {
            id: 2,
            name: "draft"
        }
    ]
    useEffect(() => {
        async function fetchData() {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) return;

            // Fetch job types
            const { data: jobTypes, error: jobTypeError } = await supabase.from("job_types").select("*");
            if (jobTypeError) {
                console.error(jobTypeError);
            }
            console.log(jobTypes, "jobTypes");
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
            if (managerProfile) setVacancyData((prevData) => ({
                ...prevData,
                company_id: managerProfile.company_id
            }));
        }

        fetchData();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setVacancyData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!user || !vacancyData.company_id) {
            alert("Unauthorized");
            return;
        }

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
                {/* Dynamically generate form fields */}
                {Object.keys(vacancyData).map((key) => {
                    const fieldValue = (vacancyData as any)[key];
                    if (key === "created_by" || key === "updated_by") return null; // Skip these fields
                    if (key === "type_id") {
                        return (
                            <div key={key}>
                                <label className="block mb-2">Job Type</label>
                                <select
                                    name={key}
                                    value={fieldValue}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Select Job Type</option>
                                    {jobTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        );
                    }
                    if (key === "location_id") {
                        return (
                            <div key={key}>
                                <label className="block mb-2">Location</label>
                                <select
                                    name={key}
                                    value={fieldValue}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Select Location</option>
                                    {locations.map((location) => (
                                        <option key={location.id} value={location.id}>
                                            {location.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        );
                    }
                    if (key === "job_level") {
                        return (
                            <div key={key}>
                                <label className="block mb-2">Job Visability</label>
                                <select
                                    name={key}
                                    value={fieldValue}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Select Visability</option>
                                    {job_level.map((location) => (
                                        <option key={location.id} value={location.id}>
                                            {location.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        );
                    }
                    if (key === "status") {
                        return (
                            <div key={key}>
                                <label className="block mb-2">Status</label>
                                <select
                                    name={key}
                                    value={fieldValue}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Select Status</option>
                                    {job_status.map((location) => (
                                        <option key={location.id} value={location.id}>
                                            {location.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        );
                    }
                    if (typeof fieldValue === "string") {
                        return (
                            <div key={key}>
                                <label className="block mb-2">{key.replace("_", " ").toUpperCase()}</label>
                                <input
                                    type="text"
                                    name={key}
                                    value={fieldValue}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    placeholder={key.replace("_", " ").toUpperCase()}
                                />
                            </div>
                        );
                    }

                    if (typeof fieldValue === "number") {
                        return (
                            <div key={key}>
                                <label className="block mb-2">{key.replace("_", " ").toUpperCase()}</label>
                                <input
                                    type="number"
                                    name={key}
                                    value={fieldValue || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    placeholder={key.replace("_", " ").toUpperCase()}
                                />
                            </div>
                        );
                    }

                    return null;
                })}

                <button type="submit" className="bg-blue-600 text-white p-2 rounded">
                    Create Vacancy
                </button>
            </form>
        </div>
    );
}
