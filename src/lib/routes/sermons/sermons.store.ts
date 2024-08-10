import { get, writable } from "svelte/store";
import type { LwpFilter, LwpPagination, LwpSort, Sermon } from "../../types";
import { Status } from "../../types";
import { sbQuerySermons } from "../../services/sermon-service";

export type SermonsStoreModel = {
    status: Status;
    data: Sermon[];
    filter: LwpFilter;
    pagination: LwpPagination;
    sort: LwpSort;
}

const filter: LwpFilter = {
    searchText: "",
}

const sort: LwpSort = {
    column: 'updated_at',
    order: 'desc'
}

const pagination: LwpPagination = {
    from: 0,
    to: 19,
    limit: 20,
    count: 0,
    page: 0,
}

const defaults: SermonsStoreModel = {
    status: Status.UNINITIALIZED,
    data: [],
    filter: filter,
    pagination: pagination,
    sort: sort,
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
    sermonsStore.update((state) => ({
        ...state,
        status: Status.LOADING,
    }))

    const state = get(sermonsStore);

    const response = await sbQuerySermons(state.pagination, state.sort, state.filter);

    sermonsStore.update((state) => ({
        ...state,
        data: response.data,
        pagination: {
            ...state.pagination,
            count: response.count,
            to: response.count < pagination.limit ? response.count : (pagination.limit - 1)
        },
        status: Status.OK
    }))
}

// page sermons function
export const pageSermons = async (pagination: LwpPagination) => {
    sermonsStore.update((state) => ({
        ...state,
        pagination: pagination,
    }));

    await querySermons();
}

// sort sermons function
export const sortSermons = async (sort: LwpSort) => {
    sermonsStore.update((state) => ({
        ...state,
        sort: sort,
    }));

    await querySermons();
}

// filter sermons function
export const filterSermons = async (filter: LwpFilter) => {
    sermonsStore.update((state) => ({
        ...state,
        filter: filter,
    }));

    await querySermons();
}