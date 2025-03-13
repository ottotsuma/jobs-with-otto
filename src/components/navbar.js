"use client"
// components/Navbar.js
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useUser } from '@/contexts/UserContext';
import { supabase } from 'superbase';

const Navbar = () => {
    const { user, setUser } = useUser();
    const router = useRouter();

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        } else {
            localStorage.setItem('user', JSON.stringify(null));
            setUser(null); // Clear user state
            router.push('/'); // Redirect to home after successful sign-out
        }
    };

    return (
        <nav>
            <ul>
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/about">About</Link>
                </li>
                <li>
                    <Link href="/contact">Contact</Link>
                </li>

                <li>
                    <Link href="/vacancies">View All Vacancies</Link>
                </li>

                <li>
                    <Link href="/companies">View All Companies</Link>
                </li>
                {user ? (
                    <>
                        <li>
                            <Link href="/profile">My Profile</Link>
                        </li>
                        <li>
                            <Link href="/analytics">Analytics</Link>
                        </li>
                        <li>
                            <Link href="/admin">Admin Dashboard</Link>
                        </li>
                        <li>
                            <Link href="/vacancies/new">Create Vacancy</Link>
                        </li>
                        <li>
                            <button onClick={handleSignOut}>Sign Out</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link href="/">Login/Sign Up</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
