"use client";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useUser } from '@/contexts/UserContext';
import { supabase } from 'superbase';
import ThemeToggle from "@/components/ThemeToggle";
import { styled } from '@stitches/react';

// Styled components using Stitches.js
const Nav = styled('nav', {
    backgroundColor: '#fff',
    padding: '1rem 2rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
});

const List = styled('ul', {
    display: 'flex',
    listStyle: 'none',
    gap: '1.5rem',
    padding: 0,
    margin: 0,
    alignItems: 'center',
});

const ListItem = styled('li', {
    display: 'inline',
});

const StyledLink = styled(Link, {
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    '&:hover': {
        color: '#007bff',
    },
});

const Button = styled('button', {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#0056b3',
    },
});

const Navbar = () => {
    const { user, setUser } = useUser();
    const router = useRouter();

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
            setUser(null); // Clear user state
            router.push('/'); // Redirect to home after successful sign-out
        } else {
            localStorage.setItem('user', JSON.stringify(null));
            setUser(null); // Clear user state
            router.push('/'); // Redirect to home after successful sign-out
        }
    };

    return (
        <Nav>
            <List>
                <ListItem>
                    <StyledLink href="/">Home</StyledLink>
                </ListItem>
                <ListItem>
                    <StyledLink href="/vacancies">View All Vacancies</StyledLink>
                </ListItem>
                <ListItem>
                    <StyledLink href="/companies">View All Companies</StyledLink>
                </ListItem>
                <ListItem>
                    <StyledLink href="/analytics">Public Analytics</StyledLink>
                </ListItem>
                {user ? (
                    <>
                        <ListItem>
                            <StyledLink href="/companies/create">Create Company</StyledLink>
                        </ListItem>
                        <ListItem>
                            <StyledLink href="/profile">My Profile</StyledLink>
                        </ListItem>
                        <ListItem>
                            <Button onClick={handleSignOut}>Sign Out</Button>
                        </ListItem>
                    </>
                ) : user?.role_name === "manager" ? (<>                   <ListItem>
                    <StyledLink href="/companies/manage">Manage Company</StyledLink>
                </ListItem>
                    <ListItem>
                        <StyledLink href="/locations/manage">Manage Locations</StyledLink>
                    </ListItem>
                    <ListItem>
                        <StyledLink href="/vacancies/new">Manage Jobs</StyledLink>
                    </ListItem></>) :
                    user?.role_name === "admin" ? (<ListItem>
                        <StyledLink href="/admin">Admin Dashboard</StyledLink>
                    </ListItem>) : (
                        <ListItem>
                            <StyledLink href="/">Login/Sign Up</StyledLink>
                        </ListItem>
                    )}
                <ListItem>
                    <ThemeToggle />
                </ListItem>
            </List>
        </Nav>
    );
};

export default Navbar;
