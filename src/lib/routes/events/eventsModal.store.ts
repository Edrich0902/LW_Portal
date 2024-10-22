import { writable } from "svelte/store";
import { Status, type Event } from "../../types"
import { sbCreateEvent, sbUpdateEvent } from "../../services/event-service";

export type EventModalStoreModel = {
    status: Status;
    event: Event | null;
}

const defaults: EventModalStoreModel = {
    status: Status.UNINITIALIZED,
    event: null,
}

export const eventModalStore = writable<EventModalStoreModel>(defaults);

export const initEventModal = async () => {
    eventModalStore.set(defaults);
}

export const updateEventBanner = async (event: Event): Promise<boolean> => {
    eventModalStore.update((state) => ({
        ...state,
    }));

    const response = await sbUpdateEvent(event);

    if (response.error != undefined) {
        eventModalStore.update((state) => ({
            ...state,
            event: null,
            status: Status.ERROR
        }));

        return false;
    }

    eventModalStore.update((state) => ({
        ...state,
        event: response.data,
    }));

    return true;
}

export const updateEvent = async (event: Event) => {
    eventModalStore.update((state) => ({
        ...state,
        status: Status.LOADING
    }));

    const response = await sbUpdateEvent(event);

    if (response.error != undefined) {
        eventModalStore.update((state) => ({
            ...state,
            event: null,
            status: Status.ERROR
        }));
    } else {
        eventModalStore.update((state) => ({
            ...state,
            event: response.data,
            status: Status.OK
        }));
    }
}

export const createEvent = async (event: Event) => {
    eventModalStore.update((state) => ({
        ...state,
        status: Status.LOADING
    }));

    const response = await sbCreateEvent(event);

    if (response.error != undefined) {
        eventModalStore.update((state) => ({
            ...state,
            event: null,
            status: Status.ERROR
        }));
    } else {
        eventModalStore.update((state) => ({
            ...state,
            event: response.data,
            status: Status.OK
        }));
    }
}