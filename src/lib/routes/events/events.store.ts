import { get, writable } from "svelte/store";
import { Status, type Event, type LwpFilter, type LwpPagination, type LwpSort } from "../../types";
import { sbQueryEvents } from "../../services/event-service";

export type EventStoreModel = {
    status: Status;
    data: Event[];
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

const defaults: EventStoreModel = {
    status: Status.UNINITIALIZED,
    data: [],
    filter: filter,
    pagination: pagination,
    sort: sort,
}

export const eventStore = writable<EventStoreModel>(defaults);

export const initEvents = async () => {
    const state: EventStoreModel = {
        ...defaults,
        status: Status.LOADING
    }

    eventStore.set(state);

    await queryEvents()
}

export const queryEvents = async () => {
    eventStore.update((state) => ({
        ...state,
        status: Status.LOADING,
    }))

    const state = get(eventStore);

    const response = await sbQueryEvents(state.pagination, state.sort, state.filter);

    eventStore.update((state) => ({
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

// page events function
export const pageEvents = async (pagination: LwpPagination) => {
    eventStore.update((state) => ({
        ...state,
        pagination: pagination,
    }));

    await queryEvents();
}

// sort events function
export const sortEvents = async (sort: LwpSort) => {
    eventStore.update((state) => ({
        ...state,
        sort: sort,
    }));

    await queryEvents();
}

// filter events function
export const filterEvents = async (filter: LwpFilter) => {
    eventStore.update((state) => ({
        ...state,
        filter: filter,
    }));

    await queryEvents();
}