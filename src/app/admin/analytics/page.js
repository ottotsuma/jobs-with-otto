'use client';
// /pages/analytics.js
import { supabase } from "superbase";
import { useState, useEffect } from 'react';
// import { getJobStats, getApplicantStats, getCompanyStats } from '@/API/analytics';

export default function Analytics() {
    const [vacanciesStats, setvacanciesStats] = useState({});
    const [applicantStats, setApplicantStats] = useState({});
    const [companyStats, setCompanyStats] = useState({});

    useEffect(() => {
        async function fetchData() {
            // Fetch data for vacanciesStats
            const { data: vacanciesData, error: vacanciesError } = await supabase
                .from('vacancies')
                .select('*');
            if (vacanciesError) {
                console.error('Error fetching vacancies data:', vacanciesError);
            } else {
                setvacanciesStats(vacanciesData);
            }

            // Fetch data for applicantStats
            const { data: applicantsData, error: applicantsError } = await supabase
                .from('applicant_profiles')
                .select('*');
            if (applicantsError) {
                console.error('Error fetching applicants data:', applicantsError);
            } else {
                setApplicantStats(applicantsData);
            }

            // Fetch data for companyStats
            const { data: companiesData, error: companiesError } = await supabase
                .from('companies')
                .select('*');
            if (companiesError) {
                console.error('Error fetching companies data:', companiesError);
            } else {
                setCompanyStats(companiesData);
            }
        }
        fetchData();
    }, []);

    return (
        <div>
            <h1>Analytics Dashboard</h1>

            <div>
                <h2>Job Postings</h2>
                <p>Total Posts: {vacanciesStats.total}</p>
                <p>Open Jobs: {vacanciesStats.open}</p>
                <p>Closed Jobs: {vacanciesStats.closed}</p>
            </div>

            <div>
                <h2>Applicants</h2>
                <p>Total Applicants: {applicantStats.total}</p>
                <p>Applicants who Applied: {applicantStats.applied}</p>
                <p>Applications Pending Review: {applicantStats.pending}</p>
            </div>

            <div>
                <h2>Company Insights</h2>
                <p>Total Companies: {companyStats.total}</p>
                <p>Active Companies: {companyStats.active}</p>
            </div>
        </div>
    );
}
