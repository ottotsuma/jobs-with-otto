// src/app/vacancies/[id]/vacancyMetadata.ts

import { supabase } from "superbase";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const { data: vacancy } = await supabase
        .from("vacancies")
        .select("*")
        .eq("id", params.id)
        .single();

    if (!vacancy) {
        return {
            title: "Job Not Found - Jobs With Otto",
            description: "The job you are looking for does not exist.",
        };
    }

    return {
        title: `${vacancy.title} - Jobs With Otto`,
        description: vacancy.description,
        openGraph: {
            title: vacancy.title,
            description: vacancy.description,
            url: `https://jobswithotto.netlify.app//vacancies/${params.id}`,
            images: [{ url: "https://jobswithotto.netlify.app//job-thumbnail.jpg" }],
        },
        twitter: {
            title: vacancy.title,
            description: vacancy.description,
            images: ["https://jobswithotto.netlify.app//job-thumbnail.jpg"],
        },
    };
}
