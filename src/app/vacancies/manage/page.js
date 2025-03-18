'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "superbase";
import { Button } from '@/styles/basic';
import Table from "@/components/Table";
import { useUser } from "@/contexts/UserContext";
export default function ManageVacancies() {
    const router = useRouter();
    const { user, setUser } = useUser();
    const [vacancies, setVacancies] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");

    const columns = vacancies.length
        ? Object.keys(vacancies[0]).map((key) => ({
            accessorKey: key,
            header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the header
        }))
        : [];

    useEffect(() => {
        fetchLocations(user?.company_id || localStorage.getItem("user")?.company_id)
    }, []);

    useEffect(() => {
        fetchVacancies(user?.company_id || localStorage.getItem("user")?.company_id)
    }, [selectedLocation, user?.company_id]);

    async function fetchVacancies(companyId) {
        let query = supabase
            .from("vacancies")
            .select("*")
            .eq("company_id", companyId);

        if (selectedLocation && selectedLocation !== '') {
            console.log("Location filter applied:", selectedLocation);
            query = query.eq("location_id", selectedLocation);
        } else {
            console.log("No location filter applied.");
        }

        const { data, error } = await query;
        if (error) console.error("Error fetching vacancies:", error);
        else setVacancies(data);
    }

    async function fetchLocations(companyId) {
        const { data, error } = await supabase.from("locations").select("*").eq("company_id", companyId);;
        if (error) console.error("Error fetching locations:", error);
        else setLocations(data);
    }

    async function deleteVacancy(vacancyId) {
        return true;
        const { error } = await supabase.from("vacancies").delete().eq("id", vacancyId);
        if (error) {
            alert("Error deleting vacancy");
            console.error(error);
        } else {
            fetchVacancies(companyId);
        }
    }

    const updateVacancies = (updatedData) => {
        setVacancies(updatedData);
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Manage Vacancies</h1>
            {/* Create new - src\app\vacancies\new\page.tsx */}
            <Button
                onClick={() => router.push(`/vacancies/new`)}
            >
                New Vacancy
            </Button>
            <select
                value={selectedLocation}
                onChange={(e) => {
                    setSelectedLocation(e.target.value);
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
            <Table
                columns={columns}
                data={locations}
                onDataChange={updateVacancies}
                deleteRow={deleteVacancy}
                bannedEdit={[
                    "company_id",
                    "id",
                    "created_at",
                    "updated_at",
                    "location_qr",
                    "created_by",
                    "updated_by",
                ]}
            />
            {/* options */}
            {/* Filter by Location */}


            {/* Job Listings - Table*/}
            {/* Jobs by Date */}
            {/* Applications */}
            {/* Assigned - Status - Could be hundreds*/}
            {/* Job Details */}
            {/* Templates - delete, update */}
        </div>
    );
}
