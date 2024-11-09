import {type Announcement, type LwpFilter, type LwpPagination, type LwpSort, Status} from "../../types";
import {get, writable} from "svelte/store";
import {sbQueryAnnouncements} from "../../services/announcement-service";

export type AnnouncementsStoreModel = {
    status: Status;
    data: Announcement[];
    filter: LwpFilter;
    pagination: LwpPagination;
    sort: LwpSort;
}

const filter: LwpFilter = {
    searchText: '',
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

const defaults: AnnouncementsStoreModel = {
    status: Status.UNINITIALIZED,
    data: [],
    filter: filter,
    pagination: pagination,
    sort: sort,
}

export const announcementsStore = writable<AnnouncementsStoreModel>(defaults);

export const initAnnouncements = async () => {
    const state: AnnouncementsStoreModel = {
        ...defaults,
        status: Status.LOADING,
    }

    announcementsStore.set(state);

    await queryAnnouncements();
}

export const queryAnnouncements = async () => {
    announcementsStore.update((state) => ({
        ...state,
        status: Status.LOADING,
    }))

    const state = get(announcementsStore);

    const response = await sbQueryAnnouncements(state.pagination, state.sort, state.filter);

    announcementsStore.update((state) => ({
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

// page announcements function
export const pageAnnouncements = async (pagination: LwpPagination) => {
    announcementsStore.update((state) => ({
        ...state,
        pagination: pagination,
    }));

    await queryAnnouncements();
}

// sort announcements function
export const sortAnnouncements = async (sort: LwpSort) => {
    announcementsStore.update((state) => ({
        ...state,
        sort: sort,
    }));

    await queryAnnouncements();
}

// filter announcements function
export const filterAnnouncements = async (filter: LwpFilter) => {
    announcementsStore.update((state) => ({
        ...state,
        filter: filter,
    }));

    await queryAnnouncements();
}