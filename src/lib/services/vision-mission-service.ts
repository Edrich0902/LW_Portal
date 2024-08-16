import { supabase } from "../../supabaseClient"
import type { SupabaseResponse, VisionMission } from "../types"

export const sbQueryVisionMission = async (keys: string[] = ['vision_statement', 'mission_statement']): Promise<SupabaseResponse<VisionMission>> => {
    const { data, error, count } = await supabase.from('meta_data').select('*', {count: 'exact'}).in('key', keys).returns<VisionMission[]>();

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
    }
}

export const sbUpdateVisionMission = async (visionMission: VisionMission[]): Promise<SupabaseResponse<VisionMission>> => {
    const { data, error } = await supabase.from('meta_data').upsert(visionMission).select().returns<VisionMission[]>();

    if (error) {
        console.error(error.code, error.message);
        return {
            data: [],
            error: error,
            count: 0,
        }
    }

    return {
        data: data,
        error: undefined,
        count: 0
    }
}