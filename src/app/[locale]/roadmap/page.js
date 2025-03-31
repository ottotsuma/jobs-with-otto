"use client";

import { Container, FocusContainer } from "@/styles/basic";
import { styled } from "@stitches/react";

const roadmapItems = [
    { title: "Users", status: "done" },
    { title: "User Types", status: "done" },
    { title: "Companies", status: "done" },
    { title: "Locations", status: "done" },
    { title: "Jobs", status: "done" },
    { title: "QR Codes", status: "testing" },
    { title: "Smart Contracts", status: "pending" },
    { title: "Permissions", status: "pending" },
    { title: "Analytics", status: "done" },
    { title: "CSV", status: "pending" },
    { title: "Feedback Form", status: "pending" },
    { title: "Candidate Search", status: "testing" },
    { title: "CVs", status: "pending" },
    { title: "Translations", status: "in_progress" },
    { title: "Geolocking", status: "testing" },
    { title: "Tracking [location]", status: "pending" },
    { title: "Recommendations", status: "pending" },
    { title: "Weights", status: "pending" },
    { title: "Visa & Qualifications", status: "testing" },
    { title: "Tags for Users, Jobs, Companies", status: "testing" },
    { title: "SQL Custom Param Search", status: "pending" },
    { title: "Credits", status: "testing" },
    { title: "Company Search", status: "done" },
    { title: "Guide/Assistant", status: "pending" },
    { title: "Job Search & Filter", status: "pending" },
    { title: "Clock In / Out", status: "testing" },
    { title: "CSV Export for Worker Hours", status: "pending" },
    { title: "Apply to Join Company as Manager", status: "done" },
    { title: "Apply to Join Company as Worker", status: "testing" },
    { title: "Assign Workers to Shifts", status: "pending" },
    { title: "Assign External Workers to Shifts", status: "pending" }
];

const StatusIndicator = styled("div", {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    variants: {
        status: {
            done: { backgroundColor: "green" },
            testing: { backgroundColor: "yellow" },
            in_progress: { backgroundColor: "orange" },
            pending: { backgroundColor: "gray" }
        }
    }
});

const Roadmap = () => {
    return (
        <Container>
            <h1>Project Roadmap</h1>
            <FocusContainer>
                <h2>Development Progress</h2>
                {roadmapItems.map((item, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px" }}>
                        <StatusIndicator status={item.status} />
                        <span>{item.title}</span>
                    </div>
                ))}
            </FocusContainer>
        </Container>
    );
};

export default Roadmap;
