import { writable } from "svelte/store";
import type { Sermon } from "../../types";
import { Status } from "../../types";
import { sbCreateSermon, sbUpdateSermon } from "../../services/sermon-service";

export type SermonModalStoreModel = {
    status: Status;
    sermon: Sermon | null;
}

const defaults: SermonModalStoreModel = {
    status: Status.UNINITIALIZED,
    sermon: null,
}

export const sermonModalStore = writable<SermonModalStoreModel>(defaults);

export const initSermonModal = async () => {
    sermonModalStore.set(defaults);
}

export const updateSermon = async (sermon: Sermon) => {
    sermonModalStore.update((state) => ({
        ...state,
        status: Status.LOADING
    }));

    const response = await sbUpdateSermon(sermon);

    if (response.error != undefined) {
        sermonModalStore.update((state) => ({
            ...state,
            sermon: null,
            status: Status.ERROR
        }));
    } else {
        sermonModalStore.update((state) => ({
            ...state,
            sermon: response.data,
            status: Status.OK
        }));
    }
}

export const createSermon = async (sermon: Sermon) => {
    sermonModalStore.update((state) => ({
        ...state,
        status: Status.LOADING
    }));

    const response = await sbCreateSermon(sermon);

    if (response.error != undefined) {
        sermonModalStore.update((state) => ({
            ...state,
            sermon: null,
            status: Status.ERROR
        }));
    } else {
        sermonModalStore.update((state) => ({
            ...state,
            sermon: response.data,
            status: Status.OK
        }));
    }
}