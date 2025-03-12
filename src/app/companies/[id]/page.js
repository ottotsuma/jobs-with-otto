"use client"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "superbase";

export default function CompanyPage() {
    const router = useRouter();
    const { id } = router.query;
    const [company, setCompany] = useState(null);
    const [vacancies, setVacancies] = useState([]);

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
                            <p className="font-semibold">{vacancy.title}</p>
                            <p>{vacancy.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No vacancies available.</p>
            )}
        </div>
    );
}
