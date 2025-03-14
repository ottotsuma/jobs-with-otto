import { supabase } from 'superbase';
import {User} from '@/types/users';
import { Dispatch, SetStateAction } from 'react';

export async function fetchProfile(user: User, setUser: Dispatch<SetStateAction<null>>) {
    // Step 1: Fetch the user's role from the user_roles table
    const { data: roleIDData, error: roleIDError } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', user.id)
        .single(); // Assuming each user has only one role

    if (roleIDError || !roleIDData?.role_id) {
        console.error('Error fetching role_id data:', roleIDError);
        return;
    }
    const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('role_name')
        .eq('id', roleIDData.role_id)
        .single();
    if (roleError || !roleData?.role_name) {
        console.error('Error fetching role data:', roleError);
        return;
    }

    // Step 2: Based on the role, fetch the corresponding profile data
    let profileData;
    if (roleData.role_name === 'applicant') {
        const { data, error } = await supabase
            .from('applicant_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single(); // Assuming each user has only one profile
        if (error) {
            console.error('Error fetching applicant profile data:', error);
            return;
        }
        profileData = data;
    } else if (roleData.role_name === 'manager') {
        const { data, error } = await supabase
            .from('manager_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single(); // Assuming each user has only one profile
        if (error) {
            console.error('Error fetching manager profile data:', error);
            return;
        }
        profileData = data;
    } else if (roleData.role_name === 'admin') {
        // Admins don't have a profile
    } else {
        console.error('Unknown role:', roleData.role_name);
        return;
    }

    // Step 3: Set the profile data to your state
    const mergedProfile = { ...user, ...profileData, ...roleData };
    mergedProfile.profileData = profileData;
    mergedProfile.roleData = roleData;
    setUser(mergedProfile); // Adjust this based on your state management
    localStorage.setItem('user', JSON.stringify(mergedProfile ?? null));
};