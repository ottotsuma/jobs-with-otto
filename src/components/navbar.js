"use client";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useUser } from '@/contexts/UserContext';
import { supabase } from 'superbase';
import ThemeToggle from "@/components/ThemeToggle";
import { styled } from '@stitches/react';
import { useState, useEffect } from 'react';
import { Button } from '@/styles/basic';

// Styled components using Stitches.js
const Nav = styled('nav', {
    backgroundColor: '#fff',
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    height: '100vh',
    left: 0,
    top: 0,
    width: '250px',
    transition: 'transform 0.3s ease-in-out',

    variants: {
        mobile: {
            true: {
                width: '100%', // Full screen on mobile
                transform: 'translateX(0)',
                position: 'fixed',

            },
            false: {
                minWidth: '200px',
                width: '15%'
            }
        },
        hidden: {
            true: {
                transform: 'translateX(-100%)',
                display: 'none'
            },
            false: {
                transform: 'translateX(0)',
                display: 'flex'

            },
        },
    },
});

const CloseButton = styled('button', {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    display: 'none', // Only show on mobile
    color: 'black',
    '@media (max-width: 1023px)': {
        display: 'block',
    },
});

const MenuButton = styled('button', {
    position: 'fixed',
    top: '1rem',
    left: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    display: 'none', // Show only on mobile
    '@media (max-width: 1023px)': {
        display: 'block',
    },
});

const List = styled('ul', {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
});

const ListItem = styled('li', {
    fontSize: '1.2rem'
});

const StyledLink = styled(Link, {
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    '&:hover': {
        color: '#007bff',
    },
});

const Navbar = () => {
    const { user, setUser } = useUser();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true); // Default open on desktop

    // Detect screen size changes
    useEffect(() => {
        const handleResize = () => {
            const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
            setIsOpen(isDesktop);
        };

        handleResize(); // Set initial state
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            localStorage.setItem('user', JSON.stringify(null));
            setUser(null);
            router.push('/');
        } else {
            console.error('Error signing out:', error);
        }
    };

    return (
        <>
            {/* Mobile Menu Button */}
            {!isOpen && <MenuButton onClick={() => setIsOpen(true)}>☰</MenuButton>}

            {/* Sidebar */}
            <Nav hidden={!isOpen} mobile={isOpen && window.innerWidth < 1024}>
                {/* Close button (only on mobile) */}
                <CloseButton onClick={() => setIsOpen(false)}>✖</CloseButton>

                <List>
                    {/* {!user && <ListItem><StyledLink href="/">Home</StyledLink></ListItem>} */}
                    {user && <ListItem><StyledLink href="/profile">My Profile</StyledLink></ListItem>}
                    {user?.role_name === "applicant" && (
                        <>
                            <ListItem><StyledLink href="/vacancies">View All Vacancies</StyledLink></ListItem>
                            <ListItem><StyledLink href="/companies">View All Companies</StyledLink></ListItem>
                            <ListItem><StyledLink href="/analytics">Public Analytics</StyledLink></ListItem>
                        </>
                    )}
                    {user?.role_name === "applicant" && user?.company_id && (<>
                        <ListItem><StyledLink href="/vacancies">My Locations + Vacancies</StyledLink></ListItem>
                        <ListItem><StyledLink href="/analytics">My Company + Vacancies</StyledLink></ListItem>
                    </>)}
                    {user?.role_name === "manager" && !user.company_id && (
                        <ListItem><StyledLink href="/companies/create">Create Company</StyledLink></ListItem>
                    )}
                    {user?.role_name === "manager" && user?.company_id && (
                        <>
                            <ListItem><StyledLink href="/companies/manage">Manage Company</StyledLink></ListItem>
                            <ListItem><StyledLink href="/locations/manage">Manage Locations</StyledLink></ListItem>
                            <ListItem><StyledLink href="/vacancies/manage">Manage Jobs</StyledLink></ListItem>
                        </>
                    )}
                    {user?.role_name === "admin" && (
                        <ListItem><StyledLink href="/admin">Admin Dashboard</StyledLink></ListItem>
                    )}
                    {!user && <ListItem><StyledLink href="/">Login/Sign Up</StyledLink></ListItem>}
                    {user && <ListItem><Button style={{ fontSize: "1rem" }} color="red" onClick={handleSignOut}>Sign Out</Button></ListItem>}
                    <ListItem><ThemeToggle /></ListItem>
                </List>
            </Nav>
        </>
    );
};

export default Navbar;
