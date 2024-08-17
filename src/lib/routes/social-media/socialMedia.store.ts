import { get, writable } from "svelte/store";
import { Status, type LwpFilter, type LwpPagination, type LwpSort, type SocialMedia } from "../../types"
import { sbQuerySocialMedia } from "../../services/social-media-service";

export type SocialMediaStoreModel = {
    status: Status;
    data: SocialMedia[];
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

const defaults: SocialMediaStoreModel = {
    status: Status.UNINITIALIZED,
    data: [],
    filter: filter,
    pagination: pagination,
    sort: sort,
}

export const socialMediaStore = writable<SocialMediaStoreModel>(defaults);

export const initSocialMedia = async () => {
    const state: SocialMediaStoreModel = {
        ...defaults,
        status: Status.LOADING,
    }

    socialMediaStore.set(state);

    await querySocialMedia();
}

export const querySocialMedia = async () => {
    socialMediaStore.update((state) => ({
        ...state,
        status: Status.LOADING,
    }))

    const state = get(socialMediaStore);

    const response = await sbQuerySocialMedia(state.pagination, state.sort, state.filter);

    socialMediaStore.update((state) => ({
        ...state,
        data: response.data,
        pagination: {
            ...state.pagination,
            count: response.count,
            to: response.count < pagination.limit ? response.count : (pagination.limit - 1)
        },
        status: Status.OK
    }));
}

// page social media function
export const pageSocialMedia = async (pagination: LwpPagination) => {
    socialMediaStore.update((state) => ({
        ...state,
        pagination: pagination,
    }));

    await querySocialMedia();
}

// sort social media function
export const sortSocialMedia = async (sort: LwpSort) => {
    socialMediaStore.update((state) => ({
        ...state,
        sort: sort,
    }));

    await querySocialMedia();
}

// filter social media function
export const filterSocialMedia = async (filter: LwpFilter) => {
    socialMediaStore.update((state) => ({
        ...state,
        filter: filter,
    }));

    await querySocialMedia();
}