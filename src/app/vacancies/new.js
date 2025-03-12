import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "superbase";

export default function NewVacancy() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [salary, setSalary] = useState("");
    const [companyId, setCompanyId] = useState(null);
    const [jobTypes, setJobTypes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [typeId, setTypeId] = useState(""); // No initial type set
    const [locationId, setLocationId] = useState(""); // No initial location set

    useEffect(() => {
        async function fetchData() {
            const { data: userData, error } = await supabase.auth.getUser();
            if (error) return;
            setUser(userData);

            // Fetch job types
            const { data: jobTypes } = await supabase.from("job_types").select("*");
            setJobTypes(jobTypes || []);

            // Fetch locations
            const { data: locations } = await supabase.from("locations").select("*");
            setLocations(locations || []);

            // Get manager's company
            const { data: managerProfile } = await supabase
                .from("manager_profiles")
                .select("company_id")
                .eq("user_id", userData?.id)
                .single();

            if (managerProfile) setCompanyId(managerProfile.company_id);
        }

        fetchData();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!user || !companyId) {
            alert("Unauthorized");
            return;
        }

        const vacancyData = {
            job_title: title,
            description,
            company_id: companyId,
            type_id: typeId || null, // Use null if no type selected
            location_id: locationId || null, // Use null if no location selected
            hourly_rate: salary || null, // Use null if salary not provided
            created_by: user.id,
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
