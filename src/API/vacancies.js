// pages/api/vacancies/index.js
import supabase from '@/lib/supabase';

export default async function vacancies_handler(req, res) {
    if (req.method === 'GET') {
        // If there is an ID in the query, get the specific vacancy
        if (req.query.id) {
            const { id } = req.query;
            const { data, error } = await supabase.from('vacancies').select('*').eq('id', id).single();
            if (error) return res.status(404).json({ error: error.message });
            return res.status(200).json(data);
        } else {
            // If no ID, return all vacancies
            const { data, error } = await supabase.from('vacancies').select('*');
            if (error) return res.status(500).json({ error: error.message });
            return res.status(200).json(data);
        }
    } else if (req.method === 'POST') {
        // Create a new vacancy
        const { error, data } = await supabase.from('vacancies').insert([req.body]);

        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data);
    } else if (req.method === 'PATCH') {
        // Update an existing vacancy partially (only fields provided)
        const { id } = req.query;

        const { data, error } = await supabase
            .from('vacancies')
            .update(req.body) // Directly pass the whole req.body
            .eq('id', id)
            .select();

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
    } else if (req.method === 'DELETE') {
        // Delete a vacancy
        const { id } = req.query;

        const { data, error } = await supabase.from('vacancies').delete().eq('id', id);

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ message: 'Vacancy deleted successfully', data });
    } else {
        // Method not allowed
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
