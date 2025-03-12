import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "superbase";

export default function CompaniesPage() {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        async function fetchCompanies() {
            let { data, error } = await supabase.from("companies").select("*");
            if (!error) setCompanies(data);
        }
        fetchCompanies();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Companies</h1>
            <ul>
                {companies.map((company) => (
                    <li key={company.id} className="mb-2">
                        <Link href={`/companies/${company.id}`} className="text-blue-600 hover:underline">
                            {company.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
