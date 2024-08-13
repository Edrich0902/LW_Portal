import { supabase } from "../../supabaseClient";
import type { LwpFilter, LwpPagination, LwpSort, SupabaseResponse, User } from "../types";
import { formatSearchText } from "../utils";

export const sbQueryUsers = async (pagination: LwpPagination, sort: LwpSort, filter?: LwpFilter): Promise<SupabaseResponse<User>> => {
    let query = supabase.from('user_profile_view').select('*', {count: "exact"});

    if (filter) {
        if (filter.searchText.trim()) query.textSearch('first_name', formatSearchText(filter.searchText));
    }

    const { data, error, count } = await query.range(pagination.from, pagination.to)
        .order(sort.column, {ascending: sort.order == 'asc'})
        .returns<User[]>();

    if (error) {
        console.error(error.code, error.message);
        return {
            data: [],
            error: error,
            count: count ?? 0,
        }
    }

    return {
        data: data,
        error: undefined,
        count: count ?? 0,
    }
}