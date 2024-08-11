import { supabase } from "../../supabaseClient";
import type { LwpFilter, LwpPagination, LwpSort, Sermon, SingleSupabaseResponse, SupabaseResponse } from "../types";
import { formatSearchText } from "../utils";

export const sbQuerySermons = async (pagination: LwpPagination, sort: LwpSort, filter?: LwpFilter): Promise<SupabaseResponse<Sermon>> => {
    let query = supabase.from('sermons').select('*', { count: "exact" });

    if (filter) {
        if (filter.searchText.trim()) query.textSearch('title', formatSearchText(filter.searchText));
    }

    const { data, error, count } = await query.range(pagination.from, pagination.to)
        .order(sort.column, { ascending: sort.order == 'asc' })
        .returns<Sermon[]>();

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

export const sbCreateSermon = async (sermon: Sermon): Promise<SingleSupabaseResponse<Sermon>> => {
    const { data, error } = await supabase.from('sermons').insert(sermon).single<Sermon>();

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

export const sbUpdateSermon = async (sermon: Sermon): Promise<SingleSupabaseResponse<Sermon>> => {
    const { data, error } = await supabase.from('sermons').update(sermon).eq('id', sermon.id).single<Sermon>();

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