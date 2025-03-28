"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/logo";
import { supabase } from "superbase";
import { styled } from "@stitches/react";
import { Container, Title } from "@/styles/basic";
import { useTitle } from "@/contexts/TitleContext";
import SideBar from "@/components/Sidebar";
import ViewLocation from "@/components/viewLocation";
import { location } from '@/types/location'

// Mapping of industries to card background colors and emoji's
const industryStyles: Record<string, { color: string; emoji: string }> = {
    Technology: { color: "#4f46e5", emoji: "💻" },
    Finance: { color: "#10b981", emoji: "💰" },
    Healthcare: { color: "#ef4444", emoji: "🏥" },
    Education: { color: "#facc15", emoji: "📚" },
    Retail: { color: "#3b82f6", emoji: "🛒" },
    // You can add more industries here...
};

const Grid = styled("div", {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px",
});

const Card = styled(Link, {
    display: "block",
    padding: "16px",
    borderRadius: "12px",
    textDecoration: "none",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
    },
});
const CardButton = styled("button", {
    display: "block",
    padding: "16px",
    borderRadius: "12px",
    textDecoration: "none",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
    },
});
const CardTitle = styled("h2", {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "8px",
});

const CardDetails = styled("p", {
    fontSize: "14px",
    marginBottom: "8px",
});

const DetailRow = styled("div", {
    marginBottom: "8px",
});

export default function LocationsPage() {
    // const currentLocale = useLocale();
    const [locations, setLocations] = useState < location[] > ([]);
    const { setTitle } = useTitle();

    const [locationModalOpen, setLocationModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState("");
    const handleLocationSelected = (location_id: string) => {
        if (location_id) {
            setSelectedLocation(location_id);
            setLocationModalOpen(true);
        }
    };

    useEffect(() => {
        setTitle("Locations");
        async function fetchLocations() {
            const { data, error } = await supabase.from("locations").select("*");
            if (!error) setLocations(data);
        }
        fetchLocations();
    }, []);

    return (
        <Container>
            <SideBar
                isOpen={locationModalOpen && !!selectedLocation}
                onClose={() => setLocationModalOpen(false)}
            >
                <ViewLocation location_id={selectedLocation} />
            </SideBar>
            <Title>Locations</Title>
            <Grid>
                {locations.map((location) => {
                    // Determine the industry style. Default to white background if not found.
                    const industryStyle = industryStyles[location.industry];
                    const backgroundColor = industryStyle
                        ? industryStyle.color
                        : "#ffffff";
                    // Use white text for colored backgrounds, black for white background.
                    const textColor = backgroundColor === "#ffffff" ? "black" : "white";

                    return (
                        <CardButton
                            key={location.id}
                            // href={`locations/${location.id}`}
                            onClick={() => {
                                handleLocationSelected(location.id);
                            }}
                            style={{ backgroundColor, color: textColor }}
                        >
                            {location.location_logo_url && (
                                <Logo
                                    src={location.location_logo_url}
                                    alt={`${location.name} logo`}
                                />
                            )}
                            <CardTitle>{location.name}</CardTitle>
                            <CardDetails>⭐ {location.average_rating || 0}</CardDetails>
                            <DetailRow>
                                {/* <strong>Type:</strong> {location.location_type} */}
                            </DetailRow>
                            {location.industry && (
                                <DetailRow>
                                    <strong>Industry:</strong>{" "}
                                    {industryStyle
                                        ? `${industryStyle.emoji} ${location.industry}`
                                        : location.industry}
                                </DetailRow>
                            )}
                            {location.foundedDate && (
                                <DetailRow>
                                    <strong>Founded:</strong> {location.foundedDate}
                                </DetailRow>
                            )}
                            {location.locationSize && (
                                <DetailRow>
                                    <strong>Size:</strong> {location.locationSize}
                                </DetailRow>
                            )}
                            {location.tags && location.tags.length > 0 && (
                                <DetailRow>
                                    <strong>Tags:</strong>{" "}
                                    {location.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                backgroundColor: "#6b7280",
                                                color: "white",
                                                padding: "2px 8px",
                                                borderRadius: "9999px",
                                                marginRight: "4px",
                                                fontSize: "12px",
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </DetailRow>
                            )}
                        </CardButton>
                        // Location comments
                        // Location jobs
                    );
                })}
            </Grid>
        </Container>
    );
}
