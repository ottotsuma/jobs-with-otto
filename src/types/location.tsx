type Point = {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
};

export type Location = {
  id: number;
  name: string;
  status: boolean;
  address?: string;
  company_id?: string; // UUID type, as it appears to be a UUID
  latitude?: number;
  longitude?: number;
  requires_geolock?: boolean;
  region?: string;
  city?: string;
  district?: string;
  postal_code?: string;
  job_approval_required?: boolean;
  create_template_only?: boolean;
  location_qr?: string;
  created_by?: string; // UUID type
  updated_by?: string; // UUID type
  time_zone?: string;
  country?: string;
  opening_hours?: string;
  created_at?: string; // Timestamp with timezone
  updated_at?: string; // Timestamp with timezone
  contact_email?: string;
  contact_phone?: string;
  location_type_id?: string; // UUID type
  geolocation?: Point;
};

export type NewLocationType = Omit<Location, "id">;

export const location_bannedEdit = [
  "company_id",
  "id",
  "created_at",
  "updated_at",
  "location_qr",
  "created_by",
  "updated_by",
  "average_rating",
];

// Example of geolocation
// // pages/api/insertLocation.js
// import supabase from '../../lib/supabase';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { name, address, latitude, longitude } = req.body;

//     try {
//       // Use PostGIS functions to insert geospatial data
//       const { data, error } = await supabase
//         .from('locations')
//         .insert([
//           {
//             name,
//             address,
//             geolocation: supabase.raw(
//               `ST_SetSRID(ST_MakePoint(?, ?), 4326)`,
//               [longitude, latitude] // longitude first, then latitude
//             ),
//           },
//         ]);

//       if (error) {
//         throw error;
//       }

//       res.status(200).json({ message: 'Location inserted successfully', data });
//     } catch (error) {
//       console.error('Error inserting location:', error);
//       res.status(500).json({ message: 'Error inserting location', error: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }
