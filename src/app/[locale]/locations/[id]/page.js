"use client"
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "superbase";
import Loading from "@/components/loading";
import {
    Button,
    Container,
    Title,
    Form,
    Input,
    ZoneGreen,
    ZoneRed,
    ZoneYellow,
    Label,
    Select,
} from "@/styles/basic";
import { useUser } from "@/contexts/UserContext";
export default function LocationPage() {
    // const router = useRouter();
    // const { id } = router.query;
    const { user, setUser } = useUser();
    const { id } = useParams();
    const [location, setLocation] = useState(null);
    const [vacancies, setVacancies] = useState([]);
    async function applyAsLocationManager(user, locationId) {
        if (!user?.id || !locationId) {
            console.error("Missing user ID or location ID.");
            return;
        }

        const { error } = await supabase
            .from("location_manager_applications")
            .insert([{ user_id: user.id, location_id: locationId, status: "pending" }]);

        if (error) {
            console.error("Error inserting application:", error);
        } else {
            console.log("Application submitted successfully.");
        }
    }
    useEffect(() => {
        if (!id) return;

        async function fetchLocation() {
            const { data, error } = await supabase.from("locations").select("*").eq("id", id).single();
            if (!error) setLocation(data);
        }

        async function fetchVacancies() {
            const { data, error } = await supabase.from("vacancies").select("*").eq("location_id", id);
            if (!error) setVacancies(data);
        }

        fetchLocation();
        fetchVacancies();
    }, [id]);

    if (!location) return <Loading />;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">{location.name}</h1>
            <p className="text-gray-700">{location.description}</p>

            <h2 className="text-xl font-bold mt-4">Vacancies</h2>
            {vacancies.length > 0 ? (
                <ul>
                    {vacancies.map((vacancy) => (
                        <li key={vacancy.id} className="mb-2">
                            <p className="font-semibold">{vacancy.job_title}</p>
                            <p>{vacancy.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No vacancies available.</p>
            )}
            {/* Comments/rating */}
            {user?.role === "manager" && <Button onClick={() => {
                applyAsLocationManager(user, id);
            }}>Apply to join location as manager</Button>}
        </div>
    );
}
