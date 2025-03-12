// pages/api/applicant-ratings/index.js
import supabase from '@/lib/supabase';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { data, error } = await supabase.from('applicant_ratings').select('*');
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json(data);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
// pages/api/applicant-ratings/index.js (Add to existing file)
if (req.method === 'POST') {
    const { applicant_id, company_id, rating, review } = req.body;

    const { data, error } = await supabase.from('applicant_ratings').insert([
        { applicant_id, company_id, rating, review }
    ]);

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
}
