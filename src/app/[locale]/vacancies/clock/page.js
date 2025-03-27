import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabase'; // Your Supabase client import
import { useEffect, useState } from 'react';

function ClockInOutPage() {
    const router = useRouter();
    const { location } = router.query; // Get locationId from query param
    const [shifts, setShifts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If locationId is not available in the query, stop loading
        if (!location) return;

        const fetchShifts = async () => {
            try {
                // Get today's date
                const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

                // Fetch shifts for the given location and today
                const { data, error } = await supabase
                    .from('shifts')
                    .select('*')
                    .eq('location_id', location) // Match by location
                    .eq('date', today) // Match by today's date
                    .order('start_time', { ascending: true }); // Order shifts by start time

                if (error) {
                    setError('Failed to fetch shifts.');
                    setLoading(false);
                    return;
                }

                setShifts(data); // Store the fetched shifts
                setLoading(false);
            } catch (err) {
                console.error("Error fetching shifts:", err);
                setError('Failed to fetch shifts.');
                setLoading(false);
            }
        };

        fetchShifts();
    }, [location]);

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
                    .insert([{ user_id: 'user_id_here', shift_id: shiftId, clock_in_time: new Date() }]); // Insert clock-in record

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

    return (
        <div>
            <h1>Clock In/Out</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Loading shifts...</p>
            ) : (
                <div>
                    {shifts.length === 0 ? (
                        <p>No shifts available for today.</p>
                    ) : (
                        shifts.map((shift) => (
                            <div key={shift.id}>
                                <h2>{shift.location_name}</h2>
                                <p>Time: {shift.start_time} - {shift.end_time}</p>
                                <button
                                    onClick={() => handleClockInOut(shift.id, shift.clocked_in)}
                                >
                                    {shift.clocked_in ? 'Clock Out' : 'Clock In'}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default ClockInOutPage;
