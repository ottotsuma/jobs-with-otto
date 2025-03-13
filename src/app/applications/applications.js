'use client';
// /pages/applications.js

import { useState, useEffect } from 'react';
import { getApplications, withdrawApplication } from '@API/applications';

export default function Applications() {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await getApplications(); // Assume a function to get applications
            setApplications(res.data);
        }
        fetchData();
    }, []);

    const handleWithdraw = async (id) => {
        await withdrawApplication(id); // Assume a function to withdraw
        setApplications(applications.filter(app => app.id !== id)); // Remove the withdrawn application
    };

    return (
        <div>
            <h1>Your Job Applications</h1>
            {applications.map(app => (
                <div key={app.id}>
                    <h2>{app.job_title} at {app.company_name}</h2>
                    <p>Status: {app.status}</p>
                    <p>Applied on: {new Date(app.created_at).toLocaleDateString()}</p>
                    <button onClick={() => handleWithdraw(app.id)}>Withdraw Application</button>
                </div>
            ))}
        </div>
    );
}
