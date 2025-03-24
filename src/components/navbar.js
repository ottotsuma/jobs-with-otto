"use client";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useUser } from '@/contexts/UserContext';
import { supabase } from 'superbase';
import ThemeToggle from "@/components/ThemeToggle";
import { styled } from '@stitches/react';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Button } from '@/styles/basic';
import Logo from '@/components/logo'
import { useTheme } from 'next-themes';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from './langSwitch';
import { useLocale } from "@/app/[locale]/hooks/useLocal";
import { useNav } from '@/contexts/navContext';

// Styled components using Stitches.js
const Nav = styled('nav', {
    backgroundColor: '#fff',
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    minHeight: '100vh',
    height: 'auto',
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
    fontSize: '1.2rem',
    display: 'flex',
    flexDirection: "column" // aligns items to the middle. 
});

const StyledLink = styled(Link, {
    textDecoration: 'none',
    fontWeight: '500',
    '&:hover': {
        color: '#007bff',
    },
});
const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState(null);

    useEffect(() => {
        const updateSize = () => setScreenSize(window.innerWidth);
        window.addEventListener("resize", updateSize);
        updateSize(); // Set initial size on mount

        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return screenSize;
};

const Navbar = () => {
    const screenSize = useScreenSize();
    const { t, i18n } = useTranslation('common');
    const { theme } = useTheme();
    const { user, setUser } = useUser();
    const { navOpen, setNavOpen } = useNav()
    const router = useRouter();
    const currentLocale = useLocale();
    const handleSignOut = async () => {
        try {
            console.log('signing out')
            console.log('Supabase instance:', supabase);
            console.log('Auth state:', supabase.auth);
            const user = await supabase.auth.getUser();
            console.log('Current user:', user);
            const { error } = await supabase.auth.signOut();
            console.log('signing out 2')
            if (!error) {
                localStorage.setItem('user', JSON.stringify(null));
                setUser(null);
                router.push(`/${currentLocale}/`);
            } else {
                console.error('Error signing out:', error);
            }
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };
    useEffect(() => {
        if (screenSize >= 1024) {
            setNavOpen(true);
        }
    }, [screenSize, setNavOpen]);
    const closeSidebar = () => {
        if (screenSize < 1024) {
            setNavOpen(false);
        }
    };
    return (
        <>
            {/* Mobile Menu Button */}
            {/* {!navOpen && <MenuButton onClick={() => setNavOpen(true)}>☰</MenuButton>} */}

            {/* Sidebar */}
            <Nav theme={theme === "dark" ? false : true} hidden={!navOpen} mobile={navOpen && screenSize < 1024}>
                {/* Close button (only on mobile) */}
                <CloseButton onClick={() => setNavOpen(false)}>✖</CloseButton>
                <List>
                    <ListItem style={{ alignItems: "center" }}><Logo /></ListItem>
                    {/* {!user && <ListItem><StyledLink onClick={closeSidebar} href={`/${currentLocale}">Home</StyledLink></ListItem>} */}
                    {user && <ListItem ><StyledLink onClick={closeSidebar} href={`/${currentLocale}/profile`}>{t('profile.my_profile')}</StyledLink></ListItem>}
                    {!user && (
                        <>
                            <ListItem><StyledLink onClick={closeSidebar} href={`/${currentLocale}/vacancies`}>{t('vacancies.view_all')}</StyledLink></ListItem>
                            <ListItem><StyledLink onClick={closeSidebar} href={`/${currentLocale}/companies`}>{t('companies.view_all')}</StyledLink></ListItem>
                            <ListItem><StyledLink onClick={closeSidebar} href={`/${currentLocale}/analytics`} passHref>{t('analytics.public')}</StyledLink></ListItem>
                        </>
                    )}
                    {user && !user?.role && (
                        <>
                            <ListItem><StyledLink onClick={closeSidebar} href={`/${currentLocale}/vacancies`}>{t('vacancies.view_all')}</StyledLink></ListItem>
                            <ListItem><StyledLink onClick={closeSidebar} href={`/${currentLocale}/companies`}>{t('companies.view_all')}</StyledLink></ListItem>
                            <ListItem><StyledLink onClick={closeSidebar} href={`/${currentLocale}/analytics`} passHref>{t('analytics.public')}</StyledLink></ListItem>
                        </>
                    )}
                    {user?.role === "anon" && (
                        <>
                            <ListItem><StyledLink onClick={closeSidebar} href={`/${currentLocale}/vacancies`}>{t('vacancies.view_all')}</StyledLink></ListItem>
                            <ListItem><StyledLink onClick={closeSidebar} href={`/${currentLocale}/companies`}>{t('companies.view_all')}</StyledLink></ListItem>
                            <ListItem><StyledLink onClick={closeSidebar} href={`/${currentLocale}/analytics`} passHref>{t('analytics.public')}</StyledLink></ListItem>
                        </>
                    )}
                    {user?.role === "applicant" && (
                        <>
                            <ListItem><StyledLink onClick={closeSidebar} href={`/${currentLocale}/vacancies`}>{t('vacancies.view_all')}</StyledLink></ListItem>
                            <ListItem><StyledLink onClick={closeSidebar} href={`/${currentLocale}/companies`}>{t('companies.view_all')}</StyledLink></ListItem>
                            <ListItem><StyledLink onClick={closeSidebar} href={`/${currentLocale}/analytics`}>{t('analytics.public')}</StyledLink></ListItem>
                        </>
                    )}
                    {user?.role === "applicant" && user?.company_id && (<>
                        <ListItem><StyledLink onClick={closeSidebar} href={`/${currentLocale}/locations/${user?.company_id}
                        `}>My Locations + Vacancies</StyledLink></ListItem>
                        <ListItem><StyledLink onClick={closeSidebar} href={`/${currentLocale}/companies/${user?.company_id}`}>My Company + Vacancies</StyledLink></ListItem>
                    </>)}
                    {user?.role === "manager" && !user.company_id && (
                        <ListItem><StyledLink onClick={closeSidebar} href={`/${currentLocale}/companies/create`}>{t('companies.create')}</StyledLink></ListItem>
                    )}
                    {user?.role === "manager" && user?.company_id && (
                        <>
                            <ListItem><StyledLink onClick={closeSidebar} href={`/${currentLocale}/companies/manage`}>{t('companies.manage')}</StyledLink></ListItem>
                            <ListItem><StyledLink onClick={closeSidebar} href={`/${currentLocale}/locations/manage`}>{t('locations.manage')}</StyledLink></ListItem>
                            <ListItem><StyledLink onClick={closeSidebar} href={`/${currentLocale}/vacancies/manage`}>{t('vacancies.manage')}</StyledLink></ListItem>
                        </>
                    )}
                    {user?.role === "admin" && (
                        <ListItem><StyledLink onClick={closeSidebar} href={`/${currentLocale}/admin`}>{t('admin.dashboard')}</StyledLink></ListItem>
                    )}
                    {!user && <ListItem><StyledLink onClick={closeSidebar} href={`/${currentLocale}/`}>{t('auth.loginSignup')}</StyledLink></ListItem>}
                    {user && <ListItem><Button style={{ fontSize: "1rem" }} color="red" onClick={handleSignOut}>{t('auth.signout')}</Button></ListItem>}
                    <ListItem><ThemeToggle /></ListItem>
                    <ListItem><LanguageSwitcher /></ListItem>
                    <Button
                        onClick={() => router.push(`/${currentLocale}/about`)}
                        color="blue"
                    >
                        about
                    </Button>
                    <Button
                        onClick={() => router.push(`/${currentLocale}/contact`)}
                        color="blue"
                    >
                        contact
                    </Button>
                </List>
            </Nav >
        </>
    );
};

export default Navbar;
