"use client";
import { useState, useEffect } from "react";
import { supabase } from "superbase";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { Company } from "@/types/company";
import { Location, location_bannedEdit } from "@/types/location";
import {
  Button,
  Container,
  Title,
  ZoneGreen,
  ZoneRed,
  ZoneYellow,
} from "@/styles/basic";
import ProtectedRoute from "@/contexts/ProtectedRoute.js";
import Table, { RowData } from "@/components/Table";
import Loading from "@/components/loading";
import { useTitle } from "@/contexts/TitleContext";
import { useLocale } from "@/app/[locale]/hooks/useLocal";
export default function ProfilePage() {
  const router = useRouter();
  const { setTitle } = useTitle();
  const currentLocale = useLocale();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const [company, setCompany] = useState<Company>({});
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, SetSelectedLocation] = useState<Location | null>(
    null
  );
  const columns: ColumnDef<Location>[] = locations.length
    ? Object.keys(locations[0]).map((key) => ({
        accessorKey: key,
        header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the header
      }))
    : [];

  const handleDataChange = (updatedData: RowData[]) => {
    setLocations(updatedData);
  };
  useEffect(() => {
    setTitle("Manage Locations");
  }, []);

  useEffect(() => {
    async function fetchLocations() {
      setLoading(true);
      setError(null);
      try {
        // Replace 'locations' with the actual table name you want to query from Supabase
        const { data, error } = await supabase
          .from("locations")
          .select("*") // Select all columns or specify the ones you need
          .eq("company_id", user?.company_id); // Adjust this query as needed

        if (error) throw error;
        setLocations(data || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchLocations();
    }
  }, [user]); // Re-fetch when the user changes
  async function updateLocation(e) {
    e.preventDefault();
  }
  async function deleteLocation(e: number) {
    const newLocations = locations.filter((_, index) => index !== e);
    setLocations(newLocations);
    // Call supabase delete.
  }
  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;
  return (
    <ProtectedRoute allowedRoles={["admin", "manager", "applicant"]}>
      {/* <ViewDetails
        isOpen={!!selectedLocation}
        data={selectedLocation}
        close={() => SetSelectedLocation(null)}
      /> */}
      <Container>
        <Title>{company.name} Locations</Title>
        <Button onClick={() => router.push(`/${currentLocale}/locations/new`)}>
          New Location
        </Button>
        <Table
          columns={columns}
          data={locations}
          onDataChange={handleDataChange}
          deleteRow={deleteLocation}
          bannedEdit={location_bannedEdit}
        />
        <>
          {/* Location QR code */}
          {/* CSV */}
          {/* Applicants pending clock in / out at each location? (mass) */}
          {/* Green Zone - Update Profile Form */}
          <ZoneGreen>
            <a
              href="https://www.youtube.com/watch?v=CjqG277Hmgg"
              target="_blank"
            >
              https://www.youtube.com/watch?v=CjqG277Hmgg
            </a>
          </ZoneGreen>

          {/* Yellow Zone - Change Password & Role Update Forms */}
          <ZoneYellow>Settings</ZoneYellow>

          {/* Red Zone - Delete Profile */}
          <ZoneRed>
            {/* <Button onClick={deleteLocation} color="red">
              Delete Location (needs warning popup)
            </Button> */}
          </ZoneRed>
        </>
      </Container>
    </ProtectedRoute>
  );
}
