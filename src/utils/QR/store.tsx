import QRCode from "qrcode";
import { supabase } from "superbase";
// 1️⃣ Generate the QR Code
async function generateQRCode(data: string) {
  try {
    return await QRCode.toDataURL(data); // Generates a Base64-encoded PNG
  } catch (err) {
    console.error("QR Code generation failed", err);
    return null;
  }
}
function base64ToBlob(base64: string, contentType = "") {
  const byteCharacters = atob(base64.split(",")[1]); // Get the base64 part after the header
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}
// 2️⃣ Upload QR Code to Supabase Storage
async function uploadQRCode(locationId: string, qrCodeImage: string) {
  // Create a file path for the QR code in Supabase storage
  const filePath = `qr-codes/location_${locationId}.png`;
  console.log(qrCodeImage, "qr");
  // Need to conver from base64 to blob first
  const qrCodeBlob = base64ToBlob(qrCodeImage, "image/png");
  console.log("QR Code Blob:", qrCodeBlob);
  // Upload the QR code image to Supabase Storage
  const { data, error } = await supabase.storage
    .from("qr-codes") // The bucket name
    .upload(filePath, qrCodeBlob, { contentType: "image/png" });

  if (error) {
    if (error?.error === "Duplicate") {
      return `https://sjmmhamltybwogoygobk.supabase.co/storage/v1/object/public/qr-codes/${filePath}`;
    } else {
      console.error("QR Upload Failed", error);
      return null;
    }
  }

  // // Get the public URL of the uploaded QR code image
  // const publicUrl = supabase.storage
  //   .from("qr-codes")
  //   .getPublicUrl(filePath).publicUrl;
  // console.log("QR Code uploaded to:", publicUrl);

  return `https://sjmmhamltybwogoygobk.supabase.co/storage/v1/object/public/qr-codes/${filePath}`;
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
  if (!locationId || typeof locationId !== "string") {
    console.error("Invalid locationId provided:", locationId);
    return;
  }
  const locationData = `http://localhost:3000/vacancies/clock?location=${locationId}`;
  console.log(locationData, "locationData");
  // Generate the QR code
  const qrCodeImage = await generateQRCode(locationData);
  if (!qrCodeImage) return;
  console.log(qrCodeImage, "qrCodeImage");
  // Upload the QR code to Supabase Storage
  const qrCodeUrl = await uploadQRCode(locationId, qrCodeImage);
  if (!qrCodeUrl) return;
  console.log(qrCodeUrl, "qrCodeUrl");
  // Update the location with the QR code URL
  const { error } = await supabase
    .from("locations")
    .update({ location_qr: qrCodeUrl })
    .eq("id", locationId);

  if (error) {
    console.error("Failed to update location with QR code", error);
    return { type: "error", error: error };
  } else {
    console.log("Location updated with QR code:", locationId);
    return locationData;
  }
}
