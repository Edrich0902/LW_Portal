import type { PostgrestError } from "@supabase/supabase-js";

export type SupabaseResponse<T> = {
    data: T[];
    count: number;
    error?: PostgrestError
}