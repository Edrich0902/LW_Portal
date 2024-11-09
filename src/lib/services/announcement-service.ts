import { supabase } from "../../supabaseClient";
import type { LwpFilter, LwpPagination, LwpSort, Announcement, SingleSupabaseResponse, SupabaseResponse } from "../types";
import { AnnouncementState } from "../types";
import { formatSearchText } from "../utils";

export const sbQueryAnnouncements = async (pagination: LwpPagination, sort: LwpSort, filter?: LwpFilter): Promise<SupabaseResponse<Announcement>> => {
    let query = supabase.from('announcements').select('*', { count: 'exact' });

    if (filter) {
        if (filter.searchText.trim()) query.textSearch('title', formatSearchText(filter.searchText));
    }

    const { data, error, count } = await query.range(pagination.from, pagination.to)
        .order(sort.column, { ascending: sort.order == 'asc' })
        .returns<Announcement[]>();

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

export const sbCreateAnnouncement = async (announcement: Announcement): Promise<SingleSupabaseResponse<Announcement>> => {
    const { data, error } = await supabase.from('announcements').insert(announcement).single<Announcement>();

    if (error) {
        console.error(error.code, error.message);
        return {
            data: null,
            error: error,
        }
    }

    return {
        data: data,
        error: undefined
    }
}

export const sbUpdateAnnouncement = async (announcement: Announcement): Promise<SingleSupabaseResponse<Announcement>> => {
    const { data, error } = await supabase.from('announcements').update(announcement).eq('id', announcement.id).single<Announcement>();

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

// TODO: possibly add new function here to handle setting state of announcement and also handling sending of notification