'use client';
import { useState, useEffect } from "react";
// import { supabase } from "superbase";
// import { ApplicantProfile, ManagerProfile, AdminProfile } from '@/types/users';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from "next/navigation";
import { Company } from '@/types/company';
import { Location } from '@/types/location';
import { Button, Container, Title, Form, Input, ZoneGreen, ZoneRed, ZoneYellow, Label, Select } from '@/styles/basic';
import ProtectedRoute from '@/contexts/ProtectedRoute.js';

export default function ProfilePage() {
    const router = useRouter();
    const { user, setUser } = useUser();
    const [company, setCompany] = useState < Company > ({});
    const [locations, setLocations] = useState < Location[] > ([]);

    const blockedValues = ["id", "user_id", "created_at", "updated_at"];

    useEffect(() => {
        async function fetchLocations(e) {
            e.preventDefault();
        }
    }, [user]);
    async function updateLocation(e) {
        e.preventDefault();
    }
    async function deleteLocation(e) {
        e.preventDefault();
    }
    return (
        <ProtectedRoute allowedRoles={['admin', 'manager', 'applicant']}>
            <Container>
                <Title>{company.name} Locations</Title>
                <>
                    {/* Green Zone - Update Profile Form */}
                    <ZoneGreen>
                        {locations.forEach((location) => 
                        <Form onSubmit={updateLocation}>
                            {Object.entries(location)
                                .filter(([key]) => !blockedValues.includes(key))
                                .map(([key, value]) => (
                                    key === "location_ids" ? (
                                        <div key={key}>
                                            <Label>Locations</Label>
                                            <Select
                                                name={key}
                                                value={value || []}
                                                onChange={(e) => {
                                                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                                    setLocations({ ...location, [key]: selectedOptions });
                                                }}
                                                multiple
                                            >
                                                <option value="">Select Location(s)</option>
                                                {locations.map((location) => (
                                                    <option key={location.id} value={location.id}>
                                                        {location.name}
                                                    </option>
                                                ))}
                                            </Select>
                                        </div>
                                    ) : (
                                        <div key={key}>
                                            <Label>{key}</Label>
                                            <Input
                                                type="text"
                                                value={value || ""}
                                                onChange={(e) => setCompany({ ...company, [key]: e.target.value })}
                                            />
                                        </div>
                                    )
                                ))
                            }
                            <Button type="submit" color="green">
                                Update Location
                            </Button>
                        </Form>
                        )}
                    </ZoneGreen>

                    {/* Yellow Zone - Change Password & Role Update Forms */}
                    <ZoneYellow>
                        Settings
                    </ZoneYellow>

                    {/* Red Zone - Delete Profile */}
                    <ZoneRed>
                        <Button onClick={deleteLocation} color="red">
                            Delete Location (needs warning popup)
                        </Button>
                    </ZoneRed>
                </>
            </Container>
            <footer>
                <Button onClick={() => router.push('/about')} color="blue">
                    about
                </Button>
                <Button onClick={() => router.push('/contact')} color="blue">
                    contact
                </Button>
            </footer>
        </ProtectedRoute>
    );
}
