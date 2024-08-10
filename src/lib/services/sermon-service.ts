import { supabase } from "../../supabaseClient";
import type { LwpFilter, LwpPagination, Sermon } from "../types";

export const sbQuerySermons = async (pagination: LwpPagination, filter?: LwpFilter): Promise<Sermon[]> => {
    // TODO: handle filtering
    const { data, error } = await supabase
                                .from('sermons')
                                .select('*')
                                .range(pagination.from, pagination.to)
                                .returns<Sermon[]>();

    if (error) {
        console.error(error.code, error.message);
        return [];
    }

    return data;
}