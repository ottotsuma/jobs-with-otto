import { useEffect, useState } from "react";
import { supabase } from "superbase";
import Link from "next/link";

export default function VacanciesPage() {
    const [vacancies, setVacancies] = useState([]);

    useEffect(() => {
        async function fetchVacancies() {
            let { data, error } = await supabase.from("vacancies").select("*");
            if (!error) setVacancies(data);
        }
        fetchVacancies();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Vacancies</h1>
            <ul>
                {vacancies.map((vacancy) => (
                    <li key={vacancy.id} className="mb-4">
                        <h2 className="font-semibold">
                            <Link href={`/vacancies/${vacancy.id}`} className="text-blue-600 hover:underline">
                                {vacancy.title}
                            </Link>
                        </h2>
                        <p>{vacancy.description}</p>
                    </li>
                ))}

            </ul>
        </div>
    );
}
