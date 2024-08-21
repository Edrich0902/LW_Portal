import { supabase } from "../../supabaseClient";
import type { Event, LwpFilter, LwpPagination, LwpSort, SingleSupabaseResponse, SupabaseResponse } from "../types";
import { formatSearchText } from "../utils";

export const sbQueryEvents = async (pagination: LwpPagination, sort: LwpSort, filter?: LwpFilter): Promise<SupabaseResponse<Event>>  => {
    let query = supabase.from('events').select('*', { count: 'exact' });

    if (filter) {
        if (filter.searchText.trim()) query.textSearch('title', formatSearchText(filter.searchText));
    }

    const { data, error, count } = await query.range(pagination.from, pagination.to)
        .order(sort.column, { ascending: sort.order == 'asc' })
        .returns<Event[]>();

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

export const sbCreateEvent = async (event: Event): Promise<SingleSupabaseResponse<Event>> => {
    const { data, error } = await supabase.from('event').insert(event).single<Event>();

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

export const sbUpdateEvent = async (event: Event): Promise<SingleSupabaseResponse<Event>> => {
    const { data, error } = await supabase.from('events').update(event).eq('id', event.id).single<Event>();

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