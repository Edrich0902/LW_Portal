import { writable } from "svelte/store";
import { Status, type Group } from "../../types"
import { sbCreateConnectServeGroup, sbUpdateConnectServeGroup } from "../../services/connect-serve-service";

export type ConnectServeModalStoreModel = {
    status: Status;
    group: Group | null;
}

const defaults: ConnectServeModalStoreModel = {
    status: Status.UNINITIALIZED,
    group: null,
}

export const connectServeModalStore = writable<ConnectServeModalStoreModel>(defaults);

export const initConnectServeModal = async () => {
    connectServeModalStore.set(defaults);
}

export const updateConnectServeGroup = async (group: Group) => {
    connectServeModalStore.update((state) => ({
        ...state,
        status: Status.LOADING
    }));

    const response = await sbUpdateConnectServeGroup(group);

    if (response.error != undefined) {
        connectServeModalStore.update((state) => ({
            ...state,
            group: null,
            status: Status.ERROR
        }));
    } else {
        connectServeModalStore.update((state) => ({
            ...state,
            group: response.data,
            status: Status.OK
        }));
    }
}

export const createConnectServeGroup = async (group: Group) => {
    connectServeModalStore.update((state) => ({
        ...state,
        status: Status.LOADING
    }));

    const response = await sbCreateConnectServeGroup(group);

    if (response.error != undefined) {
        connectServeModalStore.update((state) => ({
            ...state,
            group: null,
            status: Status.ERROR
        }));
    } else {
        connectServeModalStore.update((state) => ({
            ...state,
            group: response.data,
            status: Status.OK
        }));
    }
}