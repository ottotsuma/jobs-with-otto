export default async function handler(req, res) {
    const { method, query, body } = req;

    switch (method) {
        case "GET":
            const { data, error } = await supabase
                .from("vacancy_applicants")
                .select("*")
                .match(query);
            return error ? res.status(400).json(error) : res.status(200).json(data);

        case "POST":
            const { vacancy_id, user_id, application_status } = body;
            const { data: insertedData, error } = await supabase
                .from("vacancy_applicants")
                .insert([{ vacancy_id, user_id, application_status }]);
            return error ? res.status(400).json(error) : res.status(201).json(insertedData);

        case "PUT":
            const { data: updatedData, error: updateError } = await supabase
                .from("vacancy_applicants")
                .update(body)
                .match({ vacancy_id: query.vacancy_id, user_id: query.user_id });
            return updateError ? res.status(400).json(updateError) : res.status(200).json(updatedData);

        case "DELETE":
            const { error: deleteError } = await supabase
                .from("vacancy_applicants")
                .delete()
                .match({ vacancy_id: query.vacancy_id, user_id: query.user_id });
            return deleteError ? res.status(400).json(deleteError) : res.status(204).end();

        default:
            res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
