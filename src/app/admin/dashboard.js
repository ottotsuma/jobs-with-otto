import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "superbase";
import ProtectedRoute from '../components/ProtectedRoute';
export default function AdminDashboard() {
    const router = useRouter();
    const [tab, setTab] = useState("vacancies");
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [tab]);

    async function fetchData() {
        let table;
        switch (tab) {
            case "applicants":
                table = "applicants";
                break;
            case "managers":
                table = "manager_profiles";
                break;
            case "companies":
                table = "companies";
                break;
            default:
                table = "vacancies";
        }

        const { data, error } = await supabase.from(table).select("*");
        if (error) console.error("Error fetching data:", error);
        else setData(data);
    }

    async function deleteItem(table, id) {
        const { error } = await supabase.from(table).delete().eq("id", id);
        if (error) {
            alert("Error deleting item");
            console.error(error);
        } else {
            fetchData();
        }
    }

    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

                {/* Navigation Tabs */}
                <div className="flex gap-4 mb-4">
                    {["vacancies", "applicants", "managers", "companies"].map((section) => (
                        <button
                            key={section}
                            onClick={() => setTab(section)}
                            className={`px-4 py-2 rounded ${tab === section ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        >
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Data Table */}
                <div className="border rounded p-4 bg-white shadow">
                    {data.length > 0 ? (
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    {Object.keys(data[0])
                                        .slice(0, 4) // Show first 4 columns
                                        .map((key) => (
                                            <th key={key} className="border p-2 text-left">{key}</th>
                                        ))}
                                    <th className="border p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr key={item.id} className="border-b">
                                        {Object.values(item)
                                            .slice(0, 4)
                                            .map((value, idx) => (
                                                <td key={idx} className="border p-2">{String(value)}</td>
                                            ))}
                                        <td className="border p-2">
                                            <button
                                                onClick={() => router.push(`/admin/edit/${tab}/${item.id}`)}
                                                className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteItem(tab, item.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No data found.</p>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
