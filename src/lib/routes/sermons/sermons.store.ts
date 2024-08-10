import { writable } from "svelte/store";
import type { LwpFilter, LwpPagination, Sermon } from "../../types";
import { Status } from "../../types";
import { sbQuerySermons } from "../../services/sermon-service";

export type SermonsStoreModel = {
    status: Status;
    data: Sermon[];
    filter: LwpFilter;
    pagination: LwpPagination;
}

const pagination: LwpPagination = {
    from: 0,
    to: 10,
}

const defaults: SermonsStoreModel = {
    status: Status.UNINITIALIZED,
    data: [],
    filter: {} as LwpFilter, // TODO: implement filter
    pagination: pagination,
}

export const sermonsStore = writable<SermonsStoreModel>(defaults);

export const initSermons = async () => {
    const state: SermonsStoreModel = {
        ...defaults,
        status: Status.LOADING,
    }

    sermonsStore.set(state);

    await querySermons();
}

export const querySermons = async () => {
    const state: SermonsStoreModel = {
        ...defaults,
        status: Status.LOADING
    }

    sermonsStore.set(state);

    const response = await sbQuerySermons(state.pagination);

    sermonsStore.update((state) => ({
        ...state,
        data: response,
        status: Status.OK
    }))
}

// page sermons function

// filter sermons function