async function saveQRCodeUrl(locationId, qrCodeUrl) {
    const { data, error } = await supabase
        .from('locations')
        .update({ qr_code_url: qrCodeUrl })
        .eq('id', locationId);

    if (error) {
        console.error('Error updating location with QR code URL:', error);
    } else {
        console.log('QR code URL saved successfully:', data);
    }
}
