import type { EventType } from "../eventType";

export type Event = {
    id: string;
    title: string;
    description: string;
    time: string;
    type: EventType;
    startDate: string;
    endDate?: string;
    created_at?: string;
    updated_at?: string;
}