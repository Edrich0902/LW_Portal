import type { GroupType } from "../groupType";

export type Group = {
    id: string;
    title: string;
    description: string;
    type: GroupType;
    whatsappLink?: string;
    location?: string;
    updated_at?: string;
    created_at?: string;
}