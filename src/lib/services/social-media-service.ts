import { supabase } from "../../supabaseClient";
import type { LwpFilter, LwpPagination, LwpSort, SingleSupabaseResponse, SocialMedia, SupabaseResponse } from "../types";
import { formatSearchText } from "../utils";

export const sbQuerySocialMedia = async (pagination: LwpPagination, sort: LwpSort, filter?: LwpFilter): Promise<SupabaseResponse<SocialMedia>> => {
    let query = supabase.from('social_media').select('*', { count: 'exact' });

    if (filter) {
        if (filter.searchText.trim()) query.textSearch('title', formatSearchText(filter.searchText));
    }

    const { data, error, count } = await query.range(pagination.from, pagination.to)
        .order(sort.column, { ascending: sort.order == 'asc' })
        .returns<SocialMedia[]>();

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

export const sbCreateSocialMedia = async (socialMedia: SocialMedia): Promise<SingleSupabaseResponse<SocialMedia>> => {
    const { data, error } = await supabase.from('social_media').insert(socialMedia).single<SocialMedia>();

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

export const sbUpdateSocialMedia = async (socialMedia: SocialMedia): Promise<SingleSupabaseResponse<SocialMedia>> => {
    const { data, error } = await supabase.from('social_media').update(socialMedia).eq('id', socialMedia.id).single<SocialMedia>();

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