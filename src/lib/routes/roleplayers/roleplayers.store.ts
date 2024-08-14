import { get, writable } from "svelte/store";
import { Status, type LwpFilter, type LwpPagination, type LwpSort, type Roleplayer } from "../../types";
import { sbQueryRoleplayers } from "../../services/roleplayer-service";

export type RoleplayersStoreModel = {
    status: Status;
    data: Roleplayer[];
    filter: LwpFilter,
    pagination: LwpPagination;
    sort: LwpSort;
}

const filter: LwpFilter = {
    searchText: "",
}

const sort: LwpSort = {
    column: "updated_at",
    order: "desc"
}

const pagination: LwpPagination = {
    from: 0,
    to: 19,
    limit: 20,
    count: 0,
    page: 0,
}

const defaults: RoleplayersStoreModel = {
    status: Status.UNINITIALIZED,
    data: [],
    filter: filter,
    pagination: pagination,
    sort: sort,
}

export const roleplayersStore = writable<RoleplayersStoreModel>(defaults);

export const initRoleplayers = async () => {
    const state: RoleplayersStoreModel = {
        ...defaults,
        status: Status.LOADING,
    }

    roleplayersStore.set(state);

    await queryRoleplayers();
}

export const queryRoleplayers = async () => {
    roleplayersStore.update((state) => ({
        ...state,
        status: Status.LOADING,
    }))

    const state = get(roleplayersStore);

    const response = await sbQueryRoleplayers(state.pagination, state.sort, state.filter);

    roleplayersStore.update((state) => ({
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

// page roleplayers function
export const pageRoleplayers = async (pagination: LwpPagination) => {
    roleplayersStore.update((state) => ({
        ...state,
        pagination: pagination,
    }));

    await queryRoleplayers();
}

// sort roleplayers function
export const sortRoleplayers = async (sort: LwpSort) => {
    roleplayersStore.update((state) => ({
        ...state,
        sort: sort,
    }));

    await queryRoleplayers();
}

// filter roleplayers function
export const filterRoleplayers = async (filter: LwpFilter) => {
    roleplayersStore.update((state) => ({
        ...state,
        filter: filter,
    }));

    await queryRoleplayers();
}