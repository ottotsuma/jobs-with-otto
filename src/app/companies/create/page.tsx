'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from 'superbase';
import { newCompany } from '@/types/company';
import { updateRole } from '@/utils/utils'

const CreateCompanyPage: React.FC = () => {
    const [company, setCompany] = useState<newCompany>({ name: '' });
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCompany((prevCompany) => ({
            ...prevCompany,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data, error } = await supabase.from('companies').insert([company]);

        if (error) {
            console.error('Error creating company:', error);
        } else {
            console.log('Company created:', data);
            updateRole('manager')
            router.push('/companies/manage');
        }
    };

    return (
        <div>
            <h1>Create Company</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={company.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Create Company</button>
            </form>
        </div>
    );
};

export default CreateCompanyPage;