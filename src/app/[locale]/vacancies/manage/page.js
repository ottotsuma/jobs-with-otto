'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "superbase";
import { Button } from '@/styles/basic';
import Table from "@/components/Table";
import { useUser } from "@/contexts/UserContext";
import { vacancy_bannedEdit } from '@/types/vacancies'
import Loading from "@/components/loading";
import { useTitle } from "@/contexts/TitleContext";
import { useLocale } from "@/app/[locale]/hooks/useLocal";
import { useTranslation } from 'next-i18next';
export default function ManageVacancies() {
    const { t, i18n } = useTranslation('common');
    const router = useRouter();
    const { setTitle } = useTitle();
    const currentLocale = useLocale();
    const { user, userLoading } = useUser();
    const [loading, setLoading] = useState(true);
    const [locationsLoading, setLocationsLoading] = useState(false);
    const [vacanciesLoading, setVacanciesLoading] = useState(false);
    const [vacancies, setVacancies] = useState([]);
    const [locations, setLocations] = useState([]);
    const [shifts, setShifts] = useState({});
    const [showShifts, setShowShifts] = useState(new Set());


    const [selectedLocation, setSelectedLocation] = useState("");
    function handleShowShifts(row_id) {
        const newSet = new Set(showShifts); // Create a copy of the current set
        if (newSet.has(row_id)) {
            // If the ID is already in the set, delete it
            newSet.delete(row_id);
        } else {
            // Otherwise, add the ID to the set
            newSet.add(row_id);
        }
        const vacancy = vacancies[row_id];
        if (vacancy) fetchShifts(vacancy.id, newSet, row_id)
    }
    useEffect(() => {
        setTitle("Manage Vacancies");
    }, [])
    useEffect(() => {
        setLoading(vacanciesLoading && locationsLoading && userLoading)
    }, [vacanciesLoading, locationsLoading, userLoading]);
    useEffect(() => {
        if (!userLoading) {
            setLocationsLoading(true)
            fetchLocations(user?.company_id)
        }

    }, [userLoading]);
    useEffect(() => {
        if (!userLoading) {
            setVacanciesLoading(true)
            fetchVacancies(user?.company_id)
        }
    }, [selectedLocation, user?.company_id, userLoading]);
    async function fetchVacancies(companyId) {
        let query = supabase
            .from("vacancies")
            .select("*")
            .eq("company_id", companyId);

        if (selectedLocation && selectedLocation !== '') {
            console.log("Location filter applied:", selectedLocation);
            query = query.eq("location_id", selectedLocation);
        } else {
            console.log("No location filter applied.");
        }

        const { data, error } = await query;
        if (error) console.error("Error fetching vacancies:", error);
        else setVacancies(data);
        setVacanciesLoading(false)
    }
    async function fetchLocations(companyId) {
        const { data, error } = await supabase.from("locations").select("*").eq("company_id", companyId);;
        if (error) console.error("Error fetching locations:", error);
        else setLocations(data);
        setLocationsLoading(false)
    }
    async function deleteVacancy(vacancyId) {
        return true;
        const { error } = await supabase.from("vacancies").delete().eq("id", vacancyId);
        if (error) {
            alert("Error deleting vacancy");
            console.error(error);
        } else {
            fetchVacancies(companyId);
        }
    }
    const updateVacancies = (updatedData) => {
        setVacancies(updatedData);
    };
    async function fetchShifts(vacancy_id, newSet, row_id) {
        let query = supabase
            .from("shifts")
            .select("*")
            .eq("vacancy_id", vacancy_id);

        const { data, error } = await query;
        if (error) console.error("Error fetching vacancies:", error);
        else {
            // const data = [
            //     { shift_id: 1, start_time: "08:00", end_time: "16:00" },
            //     { shift_id: 2, start_time: "16:00", end_time: "00:00" }
            // ];
            // console.log(data, 'shift data', vacancy_id, shifts)
            setShifts(prevShifts => ({
                ...prevShifts,
                [row_id]: data // Store shifts under the row_id key
            }));
            setShowShifts(newSet);
        }
    }
    return (
        <div>
            {loading ? <Loading /> :
                <>
                    <h1>{t('vacancies.manage')}</h1>
                    {/* Create new - src\app\vacancies\new\page.tsx */}
                    <Button
                        onClick={() => router.push(`/${currentLocale}/vacancies/new`)}
                    >
                        {t('vacancies.new')}
                    </Button>
                    <select
                        value={selectedLocation}
                        onChange={(e) => {
                            setSelectedLocation(e.target.value);
                        }}
                        className="w-full p-2 border rounded mb-4"
                    >
                        <option value="">{t('locations.all')}</option>
                        {locations.map((location) => (
                            <option key={location.id} value={location.id}>
                                {location.name}
                            </option>
                        ))}
                    </select>
                    <Table
                        actions={[{
                            name: "Show Shifts",
                            function: (row_id) => { handleShowShifts(row_id) },
                            icon: "✅",
                        }]}
                        expandedData={shifts}
                        expand={showShifts}
                        expadedTitle={"Shifts:"}
                        data={vacancies}
                        onDataChange={updateVacancies}
                        deleteRow={deleteVacancy}
                        bannedEdit={vacancy_bannedEdit}
                    />
                    {/* options */}
                    {/* Filter by Location */}


                    {/* Job Listings - Table*/}
                    {/* Jobs by Date */}
                    {/* Applications */}
                    {/* Assigned - Status - Could be hundreds*/}
                    {/* Job Details */}
                    {/* Templates - delete, update */}
                </>
            }
        </div>
    );
}

// ### 1. **Expandable Row Design**  
// - Add a small icon (like a caret or "+" symbol) at the start or end of each vacancy row. Clicking it expands the row to display shift details.  
// - Use a nested table or card-like layout within the expanded area to show all shifts linked to the vacancy.

// ### 2. **Shift Table Inside Expanded Row**  
// Include these features in the shift section:  
// - **Columns:** Shift ID, Date/Time, Status, Assigned Staff (if applicable), and Actions (e.g., Edit/Delete).  
// - **Edit Mode:** Inline editing for quick updates, or an "Edit" button that opens a small form in-place.  
// - **Add Shift:** Provide an "Add Shift" button at the top or bottom of the nested table for adding new shifts.

// ### 3. **Actions & Visuals**  
// - Include a dropdown menu or buttons for "Delete All," "Duplicate Shifts," or bulk actions.
// - Add color-coded tags or icons to represent shift statuses (e.g., pending, completed, canceled).

// ### 4. **Responsive Design**  
// Ensure the expanded rows adapt well to different screen sizes. On smaller screens, the shifts could be shown in a scrollable list or stacked vertically.