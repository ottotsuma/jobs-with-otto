import { supabase } from './supabaseClient';

const { data, error } = await supabase.auth.signUp({
    email: 'user@example.com',
    password: 'password',
});
