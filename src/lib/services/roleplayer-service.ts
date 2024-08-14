import { supabase } from "../../supabaseClient";
import type { LwpFilter, LwpPagination, LwpSort, Roleplayer, SingleSupabaseResponse, SupabaseResponse } from "../types";
import { formatSearchText } from "../utils";

export const sbQueryRoleplayers = async (pagination: LwpPagination, sort: LwpSort, filter?: LwpFilter): Promise<SupabaseResponse<Roleplayer>> => {
    let query = supabase.from('roleplayers').select('*', { count: 'exact' });

    if (filter) {
        if (filter.searchText.trim()) query.textSearch('fullname', formatSearchText(filter.searchText));
    }

    const { data, error, count } = await query.range(pagination.from, pagination.to)
        .order(sort.column, { ascending: sort.order == 'asc' })
        .returns<Roleplayer[]>();

    if (error) {
        console.error(error.code, error.message);
        return {
            data: [],
            error: error,
            count: count ?? 0,
        };
    }

    return {
        data: data,
        error: undefined,
        count: count ?? 0,
    };
}

export const sbCreateRoleplayer = async (roleplayer: Roleplayer): Promise<SingleSupabaseResponse<Roleplayer>> => {
    const { data, error } = await supabase.from('roleplayers').insert(roleplayer).single<Roleplayer>();

    if (error) {
        console.error(error.code, error.message);
        return {
            data: null,
            error: error
        }
    }

    return {
        data: data,
        error: undefined
    }
}

export const sbUpdateRoleplayer = async (roleplayer: Roleplayer): Promise<SingleSupabaseResponse<Roleplayer>> => {
    const { data, error } = await supabase.from('roleplayers').update(roleplayer).eq('id', roleplayer.id).single<Roleplayer>();

    if (error) {
        console.error(error.code, error.message);
        return {
            data: null,
            error: error
        }
    }

    return {
        data: data,
        error: undefined
    }
}