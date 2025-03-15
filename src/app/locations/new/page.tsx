'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "superbase";
import { NewLocationType } from "@/types/location";
import { useUser } from '@/contexts/UserContext';

export default function NewLocation() {
    const router = useRouter();
    const { user } = useUser();
    const [location, setLocation] = useState<NewLocationType>({
        name: "",
        address: "",
        company_id: user?.company_id || ""
    }); 
    useEffect(() => {
        async function fetchData() {
            
        }
        fetchData();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocation((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!user || !user.company_id) {
            alert("Unauthorized");
            return;
        }

        const { data, error } = await supabase.from("locations").insert([location]);

        if (error) {
            alert("Error creating vacancy");
            console.error(error);
        } else {
            router.push("/manage/locations");
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Create New Vacancy</h1>
            {/* Use template */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Dynamically generate form fields */}
                {Object.keys(location).map((key) => {
                    const fieldValue = (location as any)[key];
                    if (["company_id", "created_by", "updated_by"].includes(key)) return null; // Skip these fields
                    if (key === "status") {
                        return (
                            <div key={key}>
                                <label className="block mb-2">Status</label>
                                <select
                                    name={key}
                                    value={fieldValue}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Select Status</option>
                                    {job_status.map((location) => (
                                        <option key={location.id} value={location.id}>
                                            {location.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        );
                    }
                    if (typeof fieldValue === "string") {
                        return (
                            <div key={key}>
                                <label className="block mb-2">{key.replace("_", " ").toUpperCase()}</label>
                                <input
                                    type="text"
                                    name={key}
                                    value={fieldValue}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    placeholder={key.replace("_", " ").toUpperCase()}
                                />
                            </div>
                        );
                    }
                    if (typeof fieldValue === "number") {
                        return (
                            <div key={key}>
                                <label className="block mb-2">{key.replace("_", " ").toUpperCase()}</label>
                                <input
                                    type="number"
                                    name={key}
                                    value={fieldValue || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    placeholder={key.replace("_", " ").toUpperCase()}
                                />
                            </div>
                        );
                    }
                    return null;
                })}

                <button type="submit" className="bg-blue-600 text-white p-2 rounded">
                    Create Location
                </button>
            </form>
        </div>
    );
}
