import { get, writable } from "svelte/store";
import type { LwpFilter, LwpPagination, LwpSort, User } from "../../types";
import { Status } from "../../types";
import { sbQueryUsers } from "../../services/users-service";

export type UsersStoreModel = {
    status: Status;
    data: User[];
    filter: LwpFilter;
    pagination: LwpPagination;
    sort: LwpSort;
}

const filter: LwpFilter = {
    searchText: "",
}

const sort: LwpSort = {
    column: 'updated_at',
    order: 'desc',
}

const pagination: LwpPagination = {
    from: 0,
    to: 19,
    limit: 20,
    count: 0,
    page: 0,
}

const defaults: UsersStoreModel = {
    status: Status.UNINITIALIZED,
    data: [],
    filter: filter,
    pagination: pagination,
    sort: sort,
}

export const usersStore = writable<UsersStoreModel>(defaults);

export const initUsers = async () => {
    const state: UsersStoreModel = {
        ...defaults,
        status: Status.LOADING,
    }

    usersStore.set(state);

    await queryUsers();
}

export const queryUsers = async () => {
    usersStore.update((state) => ({
        ...state,
        status: Status.LOADING,
    }));

    const state = get(usersStore);

    const response = await sbQueryUsers(state.pagination, state.sort, state.filter);

    usersStore.update((state) => ({
        ...state,
        data: response.data,
        pagination: {
            ...state.pagination,
            count: response.count,
            to: response.count < pagination.limit ? response.count : (pagination.limit - 1)
        },
        status: Status.OK,
    }));
}

// page users function
export const pageUsers = async (pagination: LwpPagination) => {
    usersStore.update((state) => ({
        ...state,
        pagination: pagination,
    }));

    await queryUsers();
}

// sort users function
export const sortUsers = async (sort: LwpSort) => {
    usersStore.update((state) => ({
        ...state,
        sort: sort,
    }));

    await queryUsers();
}

// filter users function
export const filterUsers = async (filter: LwpFilter) => {
    usersStore.update((state) => ({
        ...state,
        filter: filter,
    }));

    await queryUsers();
}