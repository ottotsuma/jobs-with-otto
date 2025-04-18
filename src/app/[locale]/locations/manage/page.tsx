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
  const [showClocks, setShowClocks] = useState(new Set());
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const [company, setCompany] = useState<Company>({});
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, SetSelectedLocation] = useState<Location | null>(
    null
  );
  const [clocks, setClocks] = useState({});
  const columns: ColumnDef<Location>[] = locations.length
    ? Object.keys(locations[0]).map((key) => ({
        accessorKey: key,
        header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the header
      }))
    : [];

  // const locationQR =
  function handleShowClocks(row_id) {
    const newSet = new Set(showClocks); // Create a copy of the current set
    if (newSet.has(row_id)) {
      // If the ID is already in the set, delete it
      newSet.delete(row_id);
    } else {
      // Otherwise, add the ID to the set
      newSet.add(row_id);
    }
    const location = locations[row_id];
    if (location) fetchClocks(location.id, newSet, row_id);
  }
  async function fetchClocks(location_id, newSet, row_id) {
    const vacancies = supabase
      .from("vacancies")
      .select("*")
      .eq("location_id", location_id);

    const { data: vacanciesData, error: vacanciesError } = await vacancies;
    if (vacanciesError) {
      console.error("Error fetching vacancies:", vacanciesError);
      return;
    }
    if (!vacanciesData || vacanciesData.length === 0) {
      console.error("No vacancies found for this location.");
      return;
    }

    const vacancy_id = vacanciesData[0].id; // replcace with loop

    const shifts = supabase
      .from("shifts")
      .select("*")
      .eq("vacancy_id", vacancy_id);

    const { data, error } = await shifts;
    if (error) console.error("Error fetching vacancies:", error);
    else {
      setClocks((prevShifts) => ({
        ...prevShifts,
        [row_id]: data,
      }));
      setShowClocks(newSet);
    }
  }
  async function updateLocation(updatedData: RowData[]) {
    setLocations(updatedData);
  }

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
          actions={[
            {
              name: "Show Pending clock in / out",
              function: (row_id) => {
                handleShowClocks(row_id);
              },
              icon: "✅",
            },
          ]}
          expandedData={clocks}
          expand={showClocks}
          expadedTitle={"Clock:"}
          columns={columns}
          data={locations}
          onDataChange={updateLocation}
          deleteRow={deleteLocation}
          bannedEdit={location_bannedEdit}
        />
        Applicants pending clock in / out at each location? (mass)
        <>
          <ZoneGreen>CSV Download</ZoneGreen>
          <ZoneYellow>CSV upload</ZoneYellow>
          <ZoneRed>
            <a
              href="https://www.youtube.com/watch?v=CjqG277Hmgg"
              target="_blank"
            >
              https://www.youtube.com/watch?v=CjqG277Hmgg
            </a>
          </ZoneRed>
        </>
      </Container>
    </ProtectedRoute>
  );
}
