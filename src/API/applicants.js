// pages/api/applicants/index.js
import supabase from '@/lib/supabase';

// Fetch all applicant profiles.
export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { data, error } = await supabase.from('applicant_profiles').select('*');
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json(data);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
// Create a new applicant profile.
if (req.method === 'POST') {
    const { user_id, full_name, bio, contact_number, location, skills } = req.body;

    const { data, error } = await supabase.from('applicant_profiles').insert([
        { user_id, full_name, bio, contact_number, location, skills }
    ]);

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
}
// Fetch a single applicant.
// pages/api/applicants/[id].js
import supabase from '@/lib/supabase';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        const { data, error } = await supabase.from('applicant_profiles').select('*').eq('user_id', id).single();
        if (error) return res.status(404).json({ error: error.message });
        res.status(200).json(data);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
