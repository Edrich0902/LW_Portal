import {type Announcement, Status} from "../../types";
import {writable} from "svelte/store";
import {sbCreateAnnouncement, sbUpdateAnnouncement} from "../../services/announcement-service";

export type AnnouncementModalStoreModel = {
    status: Status;
    announcement: Announcement | null;
}

export const defaults: AnnouncementModalStoreModel = {
    status: Status.UNINITIALIZED,
    announcement: null ,
}

export const announcementModalStore = writable<AnnouncementModalStoreModel>(defaults);

export const initAnnouncementModal = async () => {
    announcementModalStore.set(defaults);
}

export const updateAnnouncementImage = async (announcement: Announcement): Promise<boolean> => {
    announcementModalStore.update((state) => ({
        ...state,
    }));

    const response = await sbUpdateAnnouncement(announcement);

    if (response.error != undefined) {
        announcementModalStore.update((state) => ({
            ...state,
            announcement: null,
            status: Status.ERROR,
        }));

        return false;
    }

    announcementModalStore.update((state) => ({
        ...state,
        announcement: response.data,
    }));

    return true;
}

export const updateAnnouncement = async (announcement: Announcement) => {
    announcementModalStore.update((state) => ({
        ...state,
        status: Status.LOADING
    }));

    const response = await sbUpdateAnnouncement(announcement);

    if (response.error != undefined) {
        announcementModalStore.update((state) => ({
            ...state,
            announcement: null,
            status: Status.ERROR
        }));
    } else {
        announcementModalStore.update((state) => ({
            ...state,
            announcement: response.data,
            status: Status.OK
        }));
    }
}

export const createAnnouncement = async (announcement: Announcement) => {
    announcementModalStore.update((state) => ({
        ...state,
        status: Status.LOADING
    }));

    const response = await sbCreateAnnouncement(announcement);

    if (response.error != undefined) {
        announcementModalStore.update((state) => ({
            ...state,
            announcement: null,
            status: Status.ERROR
        }));
    } else {
        announcementModalStore.update((state) => ({
            ...state,
            announcement: response.data,
            status: Status.OK
        }));
    }
}