import type { EventType } from "../eventType";
import type { Weekday } from "../weekday";

export type Event = {
    id: string;
    title: string;
    description: string;
    time: string;
    type: EventType;
    day: Weekday;
    start_date?: string;
    end_date?: string;
    created_at?: string;
    updated_at?: string;
}