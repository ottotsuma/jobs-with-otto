import { createClient } from '@supabase/supabase-js';

const supabase = createClient('your-supabase-url', 'your-supabase-anon-key');

async function uploadQRCode(locationId, dataUrl) {
    const { data, error } = await supabase.storage
        .from('qr-codes')
        .upload(`location-${locationId}.png`, dataUrl, {
            contentType: 'image/png',
        });

    if (error) {
        console.error('Error uploading QR code:', error);
        return null;
    }

    const publicUrl = supabase.storage.from('qr-codes').getPublicUrl(data.path);
    return publicUrl;
}
