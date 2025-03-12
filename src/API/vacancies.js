// pages/api/vacancies/index.js
import supabase from '@/lib/supabase';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { data, error } = await supabase.from('vacancies').select('*');
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json(data);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}

// pages/api/vacancies/index.js (Add to existing file)
if (req.method === 'POST') {
    const { job_title, type_id, location_id, description, hourly_rate, company_id } = req.body;

    const { data, error } = await supabase.from('vacancies').insert([
        { job_title, type_id, location_id, description, hourly_rate, company_id }
    ]);

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
}

// pages/api/vacancies/[id].js
import supabase from '@/lib/supabase';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        const { data, error } = await supabase.from('vacancies').select('*').eq('id', id).single();
        if (error) return res.status(404).json({ error: error.message });
        res.status(200).json(data);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
