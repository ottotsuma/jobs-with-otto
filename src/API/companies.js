// pages/api/companies/index.js
import supabase from '@/lib/supabase';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { data, error } = await supabase.from('companies').select('*');
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json(data);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}

// pages/api/companies/[id].js
import supabase from '@/lib/supabase';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        const { data, error } = await supabase.from('companies').select('*').eq('id', id).single();
        if (error) return res.status(404).json({ error: error.message });
        res.status(200).json(data);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
