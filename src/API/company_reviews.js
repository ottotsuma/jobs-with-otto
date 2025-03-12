export default async function handler(req, res) {
    const { method, query, body } = req;

    switch (method) {
        case "GET":
            const { data, error } = await supabase
                .from("company_reviews")
                .select("*")
                .match(query);
            return error ? res.status(400).json(error) : res.status(200).json(data);

        case "POST":
            const { company_id, applicant_id, rating, review } = body;
            const { data: insertedData, error } = await supabase
                .from("company_reviews")
                .insert([{ company_id, applicant_id, rating, review }]);
            return error ? res.status(400).json(error) : res.status(201).json(insertedData);

        case "PUT":
            const { data: updatedData, error: updateError } = await supabase
                .from("company_reviews")
                .update(body)
                .match({ id: query.id });
            return updateError ? res.status(400).json(updateError) : res.status(200).json(updatedData);

        case "DELETE":
            const { error: deleteError } = await supabase
                .from("company_reviews")
                .delete()
                .match({ id: query.id });
            return deleteError ? res.status(400).json(deleteError) : res.status(204).end();

        default:
            res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
