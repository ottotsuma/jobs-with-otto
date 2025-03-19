"use client";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useUser } from '@/contexts/UserContext';
import { supabase } from 'superbase';
import ThemeToggle from "@/components/ThemeToggle";
import { styled } from '@stitches/react';
import { useState, useEffect } from 'react';
import { Button } from '@/styles/basic';
import Logo from '@/components/logo'
import { useTheme } from 'next-themes';
import { useTranslation } from 'next-i18next';
// Styled components using Stitches.js
const Nav = styled('nav', {
    backgroundColor: '#fff',
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    minHeight: '100vh',
    height: 'auto',
    left: 0,
    top: 0,
    width: '250px',
    transition: 'transform 0.3s ease-in-out',
    zIndex: 1000,
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
        theme: {
            true: {
                backgroundColor: '#fff',
                color: '#333',
            },
            false: {
                backgroundColor: '#1C1C1C',
                color: "WhiteSmoke"
            }
        }
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
    fontWeight: '500',
    '&:hover': {
        color: '#007bff',
    },
});

const Navbar = () => {
    const { t, i18n } = useTranslation('common');
    const { theme, setTheme } = useTheme();
    const { user, setUser } = useUser();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true); // Default open on desktop

    // Detect screen size changes
    useEffect(() => {
        console.log('Active locale:', i18n.language);
        console.log('Translation result:', t('profile.my_profile'));
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

    const closeSidebar = () => {
        if (window.innerWidth < 1024) {
            setIsOpen(false); // Close the sidebar on mobile
        }
    };

    return (
        <>
            {/* Mobile Menu Button */}
            {!isOpen && <MenuButton onClick={() => setIsOpen(true)}>☰</MenuButton>}

            {/* Sidebar */}
            <Nav theme={theme === "dark" ? false : true} hidden={!isOpen} mobile={isOpen && window.innerWidth < 1024}>
                {/* Close button (only on mobile) */}
                <CloseButton onClick={() => setIsOpen(false)}>✖</CloseButton>

                <List>
                    <Logo />

                    {/* {!user && <ListItem><StyledLink onClick={closeSidebar} href="/">Home</StyledLink></ListItem>} */}
                    {user && <ListItem><StyledLink onClick={closeSidebar} href="/profile">{t('profile.my_profile')}</StyledLink></ListItem>}
                    {!user && (
                        <>
                            <ListItem><StyledLink onClick={closeSidebar} href="/vacancies">View All Vacancies</StyledLink></ListItem>
                            <ListItem><StyledLink onClick={closeSidebar} href="/companies">View All Companies</StyledLink></ListItem>
                            <ListItem><StyledLink onClick={closeSidebar} href="/analytics">Public Analytics</StyledLink></ListItem>
                        </>
                    )}
                    {user?.role_name === "applicant" && (
                        <>
                            <ListItem><StyledLink onClick={closeSidebar} href="/vacancies">View All Vacancies</StyledLink></ListItem>
                            <ListItem><StyledLink onClick={closeSidebar} href="/companies">View All Companies</StyledLink></ListItem>
                            <ListItem><StyledLink onClick={closeSidebar} href="/analytics">Public Analytics</StyledLink></ListItem>
                        </>
                    )}
                    {user?.role_name === "applicant" && user?.company_id && (<>
                        <ListItem><StyledLink onClick={closeSidebar} href="/vacancies">My Locations + Vacancies</StyledLink></ListItem>
                        <ListItem><StyledLink onClick={closeSidebar} href="/analytics">My Company + Vacancies</StyledLink></ListItem>
                    </>)}
                    {user?.role_name === "manager" && !user.company_id && (
                        <ListItem><StyledLink onClick={closeSidebar} href="/companies/create">Create Company</StyledLink></ListItem>
                    )}
                    {user?.role_name === "manager" && user?.company_id && (
                        <>
                            <ListItem><StyledLink onClick={closeSidebar} href="/companies/manage">Manage Company</StyledLink></ListItem>
                            <ListItem><StyledLink onClick={closeSidebar} href="/locations/manage">Manage Locations</StyledLink></ListItem>
                            <ListItem><StyledLink onClick={closeSidebar} href="/vacancies/manage">Manage Jobs</StyledLink></ListItem>
                        </>
                    )}
                    {user?.role_name === "admin" && (
                        <ListItem><StyledLink onClick={closeSidebar} href="/admin">Admin Dashboard</StyledLink></ListItem>
                    )}
                    {!user && <ListItem><StyledLink onClick={closeSidebar} href="/">Login/Sign Up</StyledLink></ListItem>}
                    {user && <ListItem><Button style={{ fontSize: "1rem" }} color="red" onClick={handleSignOut}>Sign Out</Button></ListItem>}
                    <ListItem><ThemeToggle /></ListItem>
                </List>
            </Nav >
        </>
    );
};

export default Navbar;
