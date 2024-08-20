import { get, writable } from "svelte/store";
import { Status, type Group, type LwpFilter, type LwpPagination, type LwpSort } from "../../types";
import { sbQueryConnectServeGroups } from "../../services/connect-serve-service";

export type ConnectServeStoreModel = {
    status: Status;
    data: Group[];
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

const defaults: ConnectServeStoreModel = {
    status: Status.UNINITIALIZED,
    data: [],
    filter: filter,
    pagination: pagination,
    sort: sort,
}

export const connectServeStore = writable<ConnectServeStoreModel>(defaults);

export const initConnectServe = async () => {
    const state: ConnectServeStoreModel = {
        ...defaults,
        status: Status.LOADING,
    }

    connectServeStore.set(state);

    await queryConnectServeGroups();
}

export const queryConnectServeGroups = async () => {
    connectServeStore.update((state) => ({
        ...state,
        status: Status.LOADING,
    }))

    const state = get(connectServeStore);

    const response = await sbQueryConnectServeGroups(state.pagination, state.sort, state.filter);

    connectServeStore.update((state) => ({
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

// page connect serve groups function
export const pageConnectServeGroups = async (pagination: LwpPagination) => {
    connectServeStore.update((state) => ({
        ...state,
        pagination: pagination,
    }));

    await queryConnectServeGroups();
}

// sort connect serve groups function
export const sortConnectServeGroups = async (sort: LwpSort) => {
    connectServeStore.update((state) => ({
        ...state,
        sort: sort,
    }));

    await queryConnectServeGroups();
}

// filter connect serve groups function
export const filterConnectServeGroups = async (filter: LwpFilter) => {
    connectServeStore.update((state) => ({
        ...state,
        filter: filter,
    }));

    await queryConnectServeGroups();
}