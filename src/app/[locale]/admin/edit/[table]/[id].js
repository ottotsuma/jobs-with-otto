'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "superbase";
import { useLocale } from "@/app/[locale]/hooks/useLocal";
export default function EditEntry() {
    const router = useRouter();
    const currentLocale = useLocale();
    const { table, id } = router.query;
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (table && id) fetchEntry();
    }, [table, id]);

    async function fetchEntry() {
        const { data, error } = await supabase.from(table).select("*").eq("id", id).single();
        if (error) console.error("Error fetching entry:", error);
        else setFormData(data);
        setLoading(false);
    }

    async function updateEntry(e) {
        e.preventDefault();
        const { error } = await supabase.from(table).update(formData).eq("id", id);
        if (error) {
            alert("Error updating entry");
            console.error(error);
        } else {
            router.push(`/${currentLocale}/admin/dashboard`);
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Edit {table}</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <form onSubmit={updateEntry} className="space-y-4">
                    {Object.entries(formData).map(([key, value]) => (
                        <div key={key}>
                            <label className="block font-semibold">{key}</label>
                            <input
                                type="text"
                                value={value || ""}
                                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    ))}
                    <button type="submit" className="bg-green-500 text-white p-2 rounded">
                        Update
                    </button>
                </form>
            )}
        </div>
    );
}
