import { useEffect, useState } from "react";
import { supabase } from "superbase";

export default function AdminDashboard() {
    const [managers, setManagers] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [vacancies, setVacancies] = useState([]);
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const { data: managers } = await supabase.from("manager_profiles").select("*");
        const { data: applicants } = await supabase.from("applicants").select("*");
        const { data: vacancies } = await supabase.from("vacancies").select("*");
        const { data: companies } = await supabase.from("companies").select("*");

        setManagers(managers);
        setApplicants(applicants);
        setVacancies(vacancies);
        setCompanies(companies);
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            <section>
                <h2 className="text-xl font-bold">Managers</h2>
                {managers.map((m) => (
                    <div key={m.id} className="p-2 border-b">
                        {m.name} - {m.email}
                    </div>
                ))}
            </section>

            <section>
                <h2 className="text-xl font-bold mt-4">Applicants</h2>
                {applicants.map((a) => (
                    <div key={a.id} className="p-2 border-b">
                        {a.name} - {a.email}
                    </div>
                ))}
            </section>

            <section>
                <h2 className="text-xl font-bold mt-4">Vacancies</h2>
                {vacancies.map((v) => (
                    <div key={v.id} className="p-2 border-b">
                        {v.title} - {v.company_id}
                    </div>
                ))}
            </section>

            <section>
                <h2 className="text-xl font-bold mt-4">Companies</h2>
                {companies.map((c) => (
                    <div key={c.id} className="p-2 border-b">
                        {c.name} - {c.location}
                    </div>
                ))}
            </section>
        </div>
    );
}
