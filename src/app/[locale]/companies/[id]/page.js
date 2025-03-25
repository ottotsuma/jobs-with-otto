"use client"
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "superbase";
import {
    Button,
    Container,
    Title,
    Form,
    Input,
    ZoneGreen,
    ZoneRed,
    ZoneYellow,
    Label,
    Select,
} from "@/styles/basic";
import { useUser } from "@/contexts/UserContext";
export default function CompanyPage() {
    // const router = useRouter();
    // const { id } = router.query;
    const { user, setUser } = useUser();
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [vacancies, setVacancies] = useState([]);
    async function applyAsCompanyManager(user, companyId) {
        if (!user?.id || !companyId) {
            console.error("Missing user ID or company ID.");
            return;
        }

        const { error } = await supabase
            .from("company_manager_applications")
            .insert([{ user_id: user.id, company_id: companyId, status: "pending" }]);

        if (error) {
            console.error("Error inserting application:", error);
        } else {
            console.log("Application submitted successfully.");
        }
    }
    useEffect(() => {
        if (!id) return;

        async function fetchCompany() {
            const { data, error } = await supabase.from("companies").select("*").eq("id", id).single();
            if (!error) setCompany(data);
        }

        async function fetchVacancies() {
            const { data, error } = await supabase.from("vacancies").select("*").eq("company_id", id);
            if (!error) setVacancies(data);
        }

        fetchCompany();
        fetchVacancies();
    }, [id]);

    if (!company) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">{company.name}</h1>
            <p className="text-gray-700">{company.description}</p>

            <h2 className="text-xl font-bold mt-4">Vacancies</h2>
            {vacancies.length > 0 ? (
                <ul>
                    {vacancies.map((vacancy) => (
                        <li key={vacancy.id} className="mb-2">
                            <p className="font-semibold">{vacancy.job_title}</p>
                            <p>{vacancy.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No vacancies available.</p>
            )}

            {user?.role === "manager" && <Button onClick={() => {
                applyAsCompanyManager(user, id);
            }}>Apply to join company as manager</Button>}
        </div>
    );
}
