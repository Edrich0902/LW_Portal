import { supabase } from "../../supabaseClient";
import type { AuthResponse } from "../types";

export const supabaseAuth = async (email: string, password: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error != null) return {code: error.code, message: error.message, success: false}
    else return {code: 'success', message: 'Authentication Successful', success: true}
}