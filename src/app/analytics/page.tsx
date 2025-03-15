'use client';
// /pages/analytics.js
import { supabase } from "superbase";
import { useState, useEffect } from 'react';
// import { Vacancy } from "@/types/vacancies";
// import { getJobStats, getApplicantStats, getCompanyStats } from '@/API/analytics';

export default function Analytics() {
    const [vacanciesStats, setVacanciesStats] = useState([]);
    const [applicantStats, setApplicantStats] = useState<number>(0);
    const [companyStats, setCompanyStats] = useState<number>(0);

    useEffect(() => {
        // Fetch vacancy stats (total, open, and closed)
async function fetchVacancyStats() {
    // Fetch total number of vacancies
    const { count: totalCount, error: totalError } = await supabase
      .from('vacancies')
      .select('id', { count: 'exact', head: true });
    if (totalError) {
      console.error('Error fetching total vacancies:', totalError);
    }
  
    // Fetch vacancies where status is 'open'
    const { count: openCount, error: openError } = await supabase
      .from('vacancies')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'open');
    if (openError) {
      console.error('Error fetching open vacancies:', openError);
    }
  
    // Fetch vacancies where status is 'closed'
    const { count: closedCount, error: closedError } = await supabase
      .from('vacancies')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'closed');
    if (closedError) {
      console.error('Error fetching closed vacancies:', closedError);
    }
  
    // Use these counts to update your state
    setVacanciesStats({
      total: totalCount || 0,
      open: openCount || 0,
      closed: closedCount || 0,
    });
  }
  
        async function fetchData() {
            // Fetch count for applicantStats
const { count: applicantCount, error: applicantsError } = await supabase
.from('applicant_profiles')
.select('id', { count: 'exact', head: true });

if (applicantsError) {
console.error('Error fetching applicants data:', applicantsError);
} else {
setApplicantStats(applicantCount || 0);
}

// Fetch count for companyStats
const { count: companyCount, error: companiesError } = await supabase
.from('companies')
.select('id', { count: 'exact', head: true });

if (companiesError) {
console.error('Error fetching companies data:', companiesError);
} else {
setCompanyStats(companyCount || 0);
}

        }
        fetchData();
    fetchVacancyStats();

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
                <p>Total Applicants: {applicantStats}</p>
            </div>

            <div>
                <h2>Company Insights</h2>
                <p>Total Companies: {companyStats}</p>
            </div>
        </div>
    );
}
