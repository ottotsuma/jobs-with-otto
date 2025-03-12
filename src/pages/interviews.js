// /pages/interviews.js

import { useState, useEffect } from 'react';
import { getInterviews, scheduleInterview, confirmInterview, rescheduleInterview, declineInterview } from '../utils/api';

export default function Interviews() {
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await getInterviews(); // Fetch interviews for logged-in user
            setInterviews(res.data);
        }
        fetchData();
    }, []);

    const handleConfirm = async (id) => {
        await confirmInterview(id);
        setInterviews(interviews.map(interview => interview.id === id ? { ...interview, status: 'Confirmed' } : interview));
    };

    const handleReschedule = async (id) => {
        await rescheduleInterview(id);
        setInterviews(interviews.map(interview => interview.id === id ? { ...interview, status: 'Rescheduled' } : interview));
    };

    const handleDecline = async (id) => {
        await declineInterview(id);
        setInterviews(interviews.filter(interview => interview.id !== id)); // Remove declined interview
    };

    return (
        <div>
            <h1>Your Interviews</h1>
            {interviews.map(interview => (
                <div key={interview.id}>
                    <h2>{interview.job_title} with {interview.company_name}</h2>
                    <p>Scheduled for: {new Date(interview.date).toLocaleString()}</p>
                    <p>Status: {interview.status}</p>
                    {interview.status === 'Pending' && (
                        <>
                            <button onClick={() => handleConfirm(interview.id)}>Confirm</button>
                            <button onClick={() => handleReschedule(interview.id)}>Reschedule</button>
                            <button onClick={() => handleDecline(interview.id)}>Decline</button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
