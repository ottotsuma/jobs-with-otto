// components/Navbar.js
import Link from 'next/link';

const Navbar = () => (
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
                <Link href="/analytics">Analytics</Link>
            </li>
            <li>
                <Link href="/admin">Admin Dashboard</Link>
            </li>
            <li>
                <Link href="/manager">Manager Dashboard</Link>
            </li>
            <li>
                <Link href="/applicant">Applicant Dashboard</Link>
            </li>
            <li>
                <Link href="/vacancy">View All Vacancies</Link>
            </li>
            <li>
                <Link href="/vacancies/new">Create Vacancy</Link>
            </li>
            <li>
                <Link href="/company">View All Companies</Link>
            </li>
            {/* Corrected dynamic route for single company */}
            {/* <li>
                <Link href={`/company/${id}`}>View Single Company</Link>
            </li>
            <li>
                <Link href="/job/[id]">View Job</Link>
            </li> */}
            <li>
                <Link href="/profile">My Profile</Link>
            </li>
            {/* Add more links as needed */}
        </ul>
    </nav>
);

export default Navbar;
