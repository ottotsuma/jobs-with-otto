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
    const [selectedLocation, setSelectedLocation] = useState("");

    // const columns = vacancies.length
    //     ? Object.keys(vacancies[0]).map((key) => ({
    //         accessorKey: key,
    //         header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the header
    //     }))
    //     : [];

    const columns = vacancies.length
        ? Object.keys(vacancies[0]).map((key) => ({
            accessorKey: key,
            header: ({ column }) => (
                <div>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    <input
                        type="text"
                        value={column.getFilterValue() || ''}
                        onChange={(e) => column.setFilterValue(e.target.value)}
                        placeholder={`Filter ${key}`}
                    />
                </div>
            ),
            enableSorting: true,
        }))
        : [];

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
                        columns={columns}
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
