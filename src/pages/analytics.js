// /pages/analytics.js

import { useState, useEffect } from 'react';
// import { getJobStats, getApplicantStats, getCompanyStats } from '@/API/analytics';

export default function Analytics() {
    const [jobStats, setJobStats] = useState({});
    const [applicantStats, setApplicantStats] = useState({});
    const [companyStats, setCompanyStats] = useState({});

    useEffect(() => {
        async function fetchData() {
            // const jobRes = await getJobStats(); // Assume API to get job stats
            // const applicantRes = await getApplicantStats(); // Assume API for applicant stats
            // const companyRes = await getCompanyStats(); // Assume API for company stats

            setJobStats(jobRes.data);
            setApplicantStats(applicantRes.data);
            setCompanyStats(companyRes.data);
        }
        fetchData();
    }, []);

    return (
        <div>
            <h1>Analytics Dashboard</h1>

            <div>
                <h2>Job Postings</h2>
                <p>Total Posts: {jobStats.total}</p>
                <p>Open Jobs: {jobStats.open}</p>
                <p>Closed Jobs: {jobStats.closed}</p>
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
