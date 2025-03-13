'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "superbase";

export default function VacancyPage() {
    const router = useRouter();
    const { id } = router.query;
    const [vacancy, setVacancy] = useState(null);
    const [company, setCompany] = useState(null);

    useEffect(() => {
        if (!id) return;

        async function fetchVacancy() {
            const { data, error } = await supabase.from("vacancies").select("*").eq("id", id).single();
            if (!error) {
                setVacancy(data);
                fetchCompany(data.company_id);
            }
        }

        async function fetchCompany(companyId) {
            const { data, error } = await supabase.from("companies").select("*").eq("id", companyId).single();
            if (!error) setCompany(data);
        }

        fetchVacancy();
    }, [id]);

    if (!vacancy) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">{vacancy.title}</h1>
            <p className="text-gray-700">{vacancy.description}</p>

            {company && (
                <div className="mt-6">
                    <h2 className="text-xl font-bold">Company</h2>
                    <p className="text-gray-800">{company.name}</p>
                    <p className="text-gray-600">{company.description}</p>
                </div>
            )}
        </div>
    );
}
