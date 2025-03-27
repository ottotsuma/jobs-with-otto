import { createClient } from "@supabase/supabase-js";
import QRCode from "qrcode";

const supabase = createClient("your-supabase-url", "your-supabase-anon-key");

// 1️⃣ Generate the QR Code
async function generateQRCode(data: string) {
  try {
    return await QRCode.toDataURL(data); // Generates a Base64-encoded PNG
  } catch (err) {
    console.error("QR Code generation failed", err);
    return null;
  }
}

// 2️⃣ Upload QR Code to Supabase Storage
async function uploadQRCode(locationId: string, qrCodeImage: string) {
  // Create a file path for the QR code in Supabase storage
  const filePath = `qr-codes/location_${locationId}.png`;

  // Upload the QR code image to Supabase Storage
  const { data, error } = await supabase.storage
    .from("qr-codes") // The bucket name
    .upload(filePath, qrCodeImage, { contentType: "image/png" });

  if (error) {
    console.error("QR Upload Failed", error);
    return null;
  }

  // Get the public URL of the uploaded QR code image
  const publicUrl = supabase.storage
    .from("qr-codes")
    .getPublicUrl(filePath).publicUrl;
  return publicUrl;
}

// 4️⃣ Retrieve the QR Code for a Location
export async function getQRCode(locationId: string) {
  const { data: location, error } = await supabase
    .from("locations")
    .select("location_qr")
    .eq("location_id", locationId)
    .single();

  if (error) {
    console.error("Error fetching location QR code", error);
    return null;
  }

  return location?.location_qr; // This will be the URL of the QR code
}

export async function addQRCodeToLocation(locationId: string) {
  const locationData = `https://yourdomain.com/clock-in?location=${locationId}`;
  // Generate the QR code
  const qrCodeImage = await generateQRCode(locationData);
  if (!qrCodeImage) return;

  // Upload the QR code to Supabase Storage
  const qrCodeUrl = await uploadQRCode(locationId, qrCodeImage);
  if (!qrCodeUrl) return;

  // Update the location with the QR code URL
  const { error } = await supabase
    .from("locations")
    .update({ location_qr: qrCodeUrl })
    .eq("location_id", locationId);

  if (error) {
    console.error("Failed to update location with QR code", error);
    return { type: "error", error: error };
  } else {
    console.log("Location updated with QR code:", locationId);
    return locationData;
  }
}
