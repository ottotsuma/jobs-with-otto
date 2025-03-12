import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "superbase";

export default function ManageVacancies() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [companyId, setCompanyId] = useState(null);
    const [vacancies, setVacancies] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");

    useEffect(() => {
        async function fetchManagerData() {
            const { data: userData, error } = await supabase.auth.getUser();
            if (error) return;
            setUser(userData);

            // Fetch manager's company
            const { data: managerProfile } = await supabase
                .from("manager_profiles")
                .select("company_id")
                .eq("user_id", userData?.id)
                .single();

            if (managerProfile) {
                setCompanyId(managerProfile.company_id);
                fetchVacancies(managerProfile.company_id);
                fetchLocations();
            }
        }

        fetchManagerData();
    }, []);

    async function fetchVacancies(companyId) {
        let query = supabase
            .from("vacancies")
            .select("id, job_title, description, hourly_rate, location_id")
            .eq("company_id", companyId);

        if (selectedLocation) {
            query = query.eq("location_id", selectedLocation);
        }

        const { data, error } = await query;
        if (error) console.error("Error fetching vacancies:", error);
        else setVacancies(data);
    }

    async function fetchLocations() {
        const { data, error } = await supabase.from("locations").select("*");
        if (error) console.error("Error fetching locations:", error);
        else setLocations(data);
    }

    async function deleteVacancy(vacancyId) {
        const { error } = await supabase.from("vacancies").delete().eq("id", vacancyId);
        if (error) {
            alert("Error deleting vacancy");
            console.error(error);
        } else {
            fetchVacancies(companyId);
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Manage Vacancies</h1>

            {/* Filter by Location */}
            <select
                value={selectedLocation}
                onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    fetchVacancies(companyId);
                }}
                className="w-full p-2 border rounded mb-4"
            >
                <option value="">All Locations</option>
                {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                        {location.name}
                    </option>
                ))}
            </select>

            {/* Job Listings */}
            {vacancies.length > 0 ? (
                vacancies.map((vacancy) => (
                    <div key={vacancy.id} className="p-4 border rounded mb-3 shadow-sm">
                        <h2 className="text-lg font-bold">{vacancy.job_title}</h2>
                        <p className="text-gray-600">{vacancy.description}</p>
                        <p className="font-semibold">💰 {vacancy.hourly_rate} / hour</p>

                        <div className="mt-3 flex gap-2">
                            <button
                                onClick={() => router.push(`/vacancies/edit/${vacancy.id}`)}
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteVacancy(vacancy.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No vacancies found.</p>
            )}
        </div>
    );
}
