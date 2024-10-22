import { writable } from "svelte/store";
import { Status, type SocialMedia } from "../../types";
import { sbCreateSocialMedia, sbUpdateSocialMedia } from "../../services/social-media-service";

export type SocialMediaModalStoreModel = {
    status: Status;
    socialMedia: SocialMedia | null;
}

const defaults: SocialMediaModalStoreModel = {
    status: Status.UNINITIALIZED,
    socialMedia: null,
}

export const socialMediaModalStore = writable<SocialMediaModalStoreModel>(defaults);

export const initSocialMediaModal = async () => {
    socialMediaModalStore.set(defaults);
}

export const updateSocialMediaBanner = async (socialMedia: SocialMedia): Promise<boolean> => {
    socialMediaModalStore.update((state) => ({
        ...state,
    }));

    const response = await sbUpdateSocialMedia(socialMedia);

    if (response.error != undefined) {
        socialMediaModalStore.update((state) => ({
            ...state,
            socialMedia: null,
            status: Status.ERROR,
        }));

        return false;
    }

    socialMediaModalStore.update((state) => ({
        ...state,
        socialMedia: response.data,
    }))

    return true;
}

export const updateSocialMedia = async (socialMedia: SocialMedia) => {
    socialMediaModalStore.update((state) => ({
        ...state,
        status: Status.LOADING
    }));

    const response = await sbUpdateSocialMedia(socialMedia);

    if (response.error != undefined) {
        socialMediaModalStore.update((state) => ({
            ...state,
            socialMedia: null,
            status: Status.ERROR
        }));
    } else {
        socialMediaModalStore.update((state) => ({
            ...state,
            socialMedia: response.data,
            status: Status.OK
        }));
    }
}

export const createSocialMedia = async (socialMedia: SocialMedia) => {
    socialMediaModalStore.update((state) => ({
        ...state,
        status: Status.LOADING
    }));

    const response = await sbCreateSocialMedia(socialMedia);

    if (response.error != undefined) {
        socialMediaModalStore.update((state) => ({
            ...state,
            socialMedia: null,
            status: Status.ERROR
        }));
    } else {
        socialMediaModalStore.update((state) => ({
            ...state,
            socialMedia: response.data,
            status: Status.OK
        }));
    }
}