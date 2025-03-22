'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "superbase";
import ProtectedRoute from '@/contexts/ProtectedRoute.js';
import { Button, Container, FocusContainer } from '@/styles/basic';
import { createStitches } from "@stitches/react";
import Toast from '@/components/toast'
import { useLocale } from "@/app/[locale]/hooks/useLocal";
const { styled } = createStitches({
    theme: {
        colors: {
            blue600: "#2563eb",
            gray200: "#e5e7eb",
            white: "#ffffff",
            black: "#000000",
        },
        radii: {
            rounded: "4px",
        },
        space: {
            small: "8px 16px", // px-4 py-2
        },
    },
});

const Tab = styled("button", {
    padding: "$small",
    borderRadius: "$rounded",
    backgroundColor: "$gray200",
    color: "$black",
    cursor: "pointer",
    transition: "background-color 0.2s ease",

    variants: {
        active: {
            true: {
                backgroundColor: "$blue600",
                color: "$white",
            },
        },
    },
});


export default function AdminDashboard() {
    const currentLocale = useLocale();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const copyToClipboard = (value) => {
        navigator.clipboard.writeText(String(value));
        setToastMessage("Copied to clipboard!");
        setShowToast(true);
    };
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
                table = "applicant_profiles";
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
            <Toast message={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

                {/* Navigation Tabs */}
                <div className="flex gap-4 mb-4">
                    {["vacancies", "applicants", "managers", "companies"].map((section) => (
                        <Tab
                            key={section}
                            onClick={() => setTab(section)}
                            active={tab === section}
                        >
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                        </Tab>
                    ))}
                </div>

                {/* Data Table */}
                <div className="border rounded p-4 bg-white shadow">
                    {data.length > 0 ? (
                        <table style={{ borderSpacing: "10px" }}>
                            <thead>
                                <tr className="bg-gray-100">
                                    {Object.keys(data[0])
                                        .slice(0, 4) // Show first 4 columns
                                        .map((key) => (
                                            <th key={key} style={{ border: "1px solid white", padding: "10px" }}>{key}</th>
                                        ))}
                                    <th style={{ border: "1px solid white", padding: "10px" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr key={item.id} className="border-b">
                                        {Object.values(item)
                                            .slice(0, 4)
                                            .map((value, idx) => (
                                                <td key={idx} style={{ border: "1px solid white", padding: "10px", cursor: "copy", }}
                                                    onClick={() => copyToClipboard(value)}
                                                >{String(value)}</td>
                                            ))}
                                        <td style={{ border: "1px solid white", padding: "10px" }}>
                                            <Button
                                                onClick={() => router.push(`/${currentLocale}/admin/edit/${tab}/${item.id}`)}
                                                style={{ border: "1px solid white", padding: "10px", margin: '5px' }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => deleteItem(tab, item.id)}
                                                style={{ border: "1px solid white", padding: "10px", margin: '5px' }}
                                                color="red"
                                            >
                                                Delete
                                            </Button>
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
