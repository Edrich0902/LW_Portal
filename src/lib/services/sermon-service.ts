import { supabase } from "../../supabaseClient";
import type { LwpFilter, LwpPagination, LwpSort, Sermon, SupabaseResponse } from "../types";

export const sbQuerySermons = async (pagination: LwpPagination, sort: LwpSort, filter?: LwpFilter): Promise<SupabaseResponse<Sermon>> => {
    // TODO: handle filtering
    const { data, error, count } = await supabase
                                .from('sermons')
                                .select('*', { count: "exact" })
                                .range(pagination.from, pagination.to)
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