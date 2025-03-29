"use client";
import { useRouter } from 'next/navigation';
import { supabase } from "superbase";
import { useEffect, useState } from 'react';
import { useUser } from "@/contexts/UserContext";
import { Auth } from "@supabase/auth-ui-react";
import Loading from "@/components/loading";
import { Container, FocusContainer } from "@/styles/basic";
function ClockInOutPage() {
    const router = useRouter();
    const [vacancies, setVacancies] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [selectedShift, setSelectedShift] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState("");

    const { user } = useUser();

    useEffect(() => {
        if (!location) return;

        const fetchVacanciesAndShifts = async () => {
            try {
                // Fetch all vacancies by location_id
                const { data: vacancyData, error: vacancyError } = await supabase
                    .from('vacancies')
                    .select('*')
                    .eq('location_id', location);

                if (vacancyError) {
                    setError('Failed to fetch vacancies.');
                    setLoading(false);
                    return;
                }

                setVacancies(vacancyData); // Store the vacancies
                setLoading(false);
            } catch (err) {
                console.error("Error fetching vacancies:", err);
                setError('An error occurred while fetching vacancies.');
                setLoading(false);
            }
        };

        fetchVacanciesAndShifts();
    }, [location]);

    const fetchShiftsForVacancy = async (vacancyId) => {
        try {
            const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
            const { data, error } = await supabase
                .from('shifts')
                .select('*')
                .eq('vacancy_id', vacancyId)  // Match shifts by the selected vacancy
                .eq('applicant_id', user?.id)  // Filter shifts by the logged-in user
                .eq('start_time', today)      // Match today's date
                .order('start_time', { ascending: true });

            if (error) {
                setError('Failed to fetch shifts.');
                return;
            }

            setShifts(data); // Store the fetched shifts
        } catch (err) {
            console.error("Error fetching shifts:", err);
            setError('An error occurred while fetching shifts.');
        }
    };

    const handleVacancySelect = (vacancyId) => {
        setSelectedShift(null); // Reset shift selection when a new vacancy is selected
        fetchShiftsForVacancy(vacancyId); // Fetch shifts for the selected vacancy
    };

    const handleClockInOut = async (shiftId, clockedIn) => {
        if (clockedIn) {
            // Clock-out the user if they're clocked in
            try {
                const { data, error } = await supabase
                    .from('clock_ins')
                    .update({ clock_out_time: new Date() })
                    .eq('shift_id', shiftId)
                    .eq('clock_out_time', null); // Ensure we're updating an ongoing shift

                if (error) {
                    console.error("Error clocking out:", error);
                    setError('Failed to clock out.');
                    return;
                }

                alert('Clocked out successfully!');
                setShifts(prevShifts => prevShifts.map(shift =>
                    shift.id === shiftId ? { ...shift, clocked_in: false } : shift
                ));
            } catch (err) {
                console.error("Error clocking out:", err);
                setError('An error occurred while clocking out.');
            }
        } else {
            // Clock-in the user if they're not clocked in
            try {
                const { data, error } = await supabase
                    .from('clock_ins')
                    .insert([{ user_id: user?.id, shift_id: shiftId, clock_in_time: new Date() }]); // Insert clock-in record

                if (error) {
                    console.error("Error clocking in:", error);
                    setError('Failed to clock in.');
                    return;
                }

                alert('Clocked in successfully!');
                setShifts(prevShifts => prevShifts.map(shift =>
                    shift.id === shiftId ? { ...shift, clocked_in: true } : shift
                ));
            } catch (err) {
                console.error("Error clocking in:", err);
                setError('An error occurred while clocking in.');
            }
        }
    };

    useEffect(() => {
        // Capture the current URL with query parameters and store it in session storage
        const currentLocation = window.location.href;
        sessionStorage.setItem('redirectURL', currentLocation);
        // Use URLSearchParams to parse the query string
        const searchParams = new URLSearchParams(window.location.search);

        // Get the value of the 'location' parameter
        const locationValue = searchParams.get('location'); // This will return '2' if present

        // Set the location in state
        setLocation(locationValue);
    }, []);

    const handleRedirectAfterLogin = () => {
        const redirectURL = sessionStorage.getItem('redirectURL');

        // Once user is logged in, redirect to the original URL if it exists
        if (redirectURL) {
            router.push(redirectURL);
            // Use URLSearchParams to parse the query string
            const searchParams = new URLSearchParams(window.location.search);

            // Get the value of the 'location' parameter
            const locationValue = searchParams.get('location'); // This will return '2' if present

            // Set the location in state
            setLocation(locationValue);
            sessionStorage.removeItem('redirectURL'); // Clean up after redirect
        } else {
            router.push('/default-path'); // Fallback if no redirect URL exists
        }
    };

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                handleRedirectAfterLogin();
            }
        });

        // Clean up the subscription when the component unmounts
        return () => {
            subscription.unsubscribe();
        };
    }, []);
    if (!user) {
        return (
            <Container>
                <FocusContainer>
                    Please Login before you can clock in or out
                    <Auth
                        supabaseClient={supabase}
                        providers={[]}
                        socialLayout="horizontal"
                        socialButtonSize="xlarge"
                    />
                </FocusContainer>
            </Container>
        )
    }
    return (
        <div>
            <h1>Clock In/Out</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <Loading />
            ) : (
                <div>
                    {vacancies.length === 0 ? (
                        <p>No vacancies available for this location.</p>
                    ) : (
                        <div>
                            <h2>Select a Vacancy</h2>
                            <ul>
                                {vacancies.map((vacancy) => (
                                    <li key={vacancy.id}>
                                        <button onClick={() => handleVacancySelect(vacancy.id)}>
                                            {vacancy.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {shifts.length === 0 ? (
                        <p>No shifts available for today.</p>
                    ) : (
                        <div>
                            <h2>Select a Shift</h2>
                            {shifts.map((shift) => (
                                <div key={shift.id}>
                                    <p>Time: {shift.start_time} - {shift.end_time}</p>
                                    <button
                                        onClick={() => handleClockInOut(shift.id, shift.clocked_in)}
                                    >
                                        {shift.clocked_in ? 'Clock Out' : 'Clock In'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ClockInOutPage;
