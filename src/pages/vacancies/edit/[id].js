import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "superbase";

export default function EditVacancy() {
    const router = useRouter();
    const { id } = router.query;
    const [vacancy, setVacancy] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [salary, setSalary] = useState("");

    useEffect(() => {
        if (id) fetchVacancy();
    }, [id]);

    async function fetchVacancy() {
        const { data, error } = await supabase
            .from("vacancies")
            .select("*")
            .eq("id", id)
            .single();

        if (error) console.error(error);
        else {
            setVacancy(data);
            setTitle(data.job_title);
            setDescription(data.description);
            setSalary(data.hourly_rate);
        }
    }

    async function updateVacancy(e) {
        e.preventDefault();
        const { error } = await supabase
            .from("vacancies")
            .update({ job_title: title, description, hourly_rate: salary })
            .eq("id", id);

        if (error) {
            alert("Error updating vacancy");
            console.error(error);
        } else {
            router.push("/vacancies/manage");
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Edit Vacancy</h1>
            {vacancy ? (
                <form onSubmit={updateVacancy} className="space-y-4">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <button type="submit" className="bg-green-500 text-white p-2 rounded">
                        Update Vacancy
                    </button>
                </form>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
