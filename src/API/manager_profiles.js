import { supabase } from "superbase";

export default async function handler(req, res) {
    const { method, query, body } = req;

    switch (method) {
        case "GET":
            const { data, error } = await supabase
                .from("manager_profiles")
                .select("*")
                .match(query);
            if (error) return res.status(400).json(error);
            return res.status(200).json(data);

        case "POST":
            const { user_id, full_name, company_id, job_position, contact_email, location_ids } = body;
            const { data: insertedData, error: insertError } = await supabase
                .from("manager_profiles")
                .insert([{ user_id, full_name, company_id, job_position, contact_email, location_ids }]);
            if (insertError) return res.status(400).json(insertError);
            return res.status(201).json(insertedData);

        case "PUT":
            const { data: updatedData, error: updateError } = await supabase
                .from("manager_profiles")
                .update(body)
                .match({ user_id: query.user_id });
            if (updateError) return res.status(400).json(updateError);
            return res.status(200).json(updatedData);

        case "DELETE":
            const { error: deleteError } = await supabase
                .from("manager_profiles")
                .delete()
                .match({ user_id: query.user_id });
            if (deleteError) return res.status(400).json(deleteError);
            return res.status(204).end();

        default:
            res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
