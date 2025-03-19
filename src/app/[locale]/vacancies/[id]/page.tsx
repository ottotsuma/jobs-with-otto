// src/app/vacancies/[id]/page.tsx
'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "superbase";
import Script from "next/script";
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
             {/* JSON-LD Structured Data for SEO */}
             <Script
                id="job-posting-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "JobPosting",
                        title: vacancy.title,
                        description: vacancy.description,
                        hiringOrganization: {
                            "@type": "Organization",
                            name: company?.name || "Unknown Company",
                            url: "https://companydomain.com",
                        },
                        datePosted: vacancy.created_at,
                        employmentType: vacancy.job_type || "Full-time",
                        jobLocation: {
                            "@type": "Place",
                            address: {
                                "@type": "PostalAddress",
                                addressLocality: vacancy.location || "Remote",
                                addressRegion: "Region Name",
                                addressCountry: "Country",
                            },
                        },
                    }),
                }}
            />
        </div>
    );
}
