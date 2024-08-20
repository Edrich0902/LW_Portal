import { supabase } from "../../supabaseClient";
import type { Group, LwpFilter, LwpPagination, LwpSort, SingleSupabaseResponse, SupabaseResponse } from "../types";
import { formatSearchText } from "../utils";

export const sbQueryConnectServeGroups = async (pagination: LwpPagination, sort: LwpSort, filter?: LwpFilter): Promise<SupabaseResponse<Group>> => {
    let query = supabase.from('groups').select('*', { count: 'exact' });

    if (filter) {
        if (filter.searchText.trim()) query.textSearch('title', formatSearchText(filter.searchText));
    }

    const { data, error, count } = await query.range(pagination.from, pagination.to)
        .order(sort.column, { ascending: sort.order == 'asc' })
        .returns<Group[]>();

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

export const sbCreateConnectServeGroup = async (group: Group): Promise<SingleSupabaseResponse<Group>> => {
    const { data, error } = await supabase.from('groups').insert(group).single<Group>();

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

export const sbUpdateConnectServeGroup = async (group: Group): Promise<SingleSupabaseResponse<Group>> => {
    const { data, error } = await supabase.from('groups').update(group).eq('id', group.id).single<Group>();

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