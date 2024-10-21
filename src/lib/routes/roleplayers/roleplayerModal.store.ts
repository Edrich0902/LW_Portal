import { writable } from "svelte/store";
import { Status, type Roleplayer } from "../../types"
import { sbCreateRoleplayer, sbUpdateRoleplayer } from "../../services/roleplayer-service";

export type RoleplayerModalStoreModel = {
    status: Status;
    roleplayer: Roleplayer | null;
}

const defaults: RoleplayerModalStoreModel = {
    status: Status.UNINITIALIZED,
    roleplayer: null,
}

export const roleplayerModalStore = writable<RoleplayerModalStoreModel>(defaults);

export const initRoleplayerModal = async () => {
    roleplayerModalStore.set(defaults);
}

export const updateRoleplayerPicture = async (roleplayer: Roleplayer): Promise<boolean> => {
    roleplayerModalStore.update((state) => ({
        ...state,
    }));

    const response = await sbUpdateRoleplayer(roleplayer);

    if (response.error != undefined) {
        roleplayerModalStore.update((state) => ({
            ...state,
            roleplayer: null,
            status: Status.ERROR
        }));

        return false;
    }

    roleplayerModalStore.update((state) => ({
        ...state,
        roleplayer: response.data,
    }));

    return true;
}

export const updateRoleplayer = async (rolepayer: Roleplayer) => {
    roleplayerModalStore.update((state) => ({
        ...state,
        status: Status.LOADING
    }));

    const response = await sbUpdateRoleplayer(rolepayer);

    if (response.error != undefined) {
        roleplayerModalStore.update((state) => ({
            ...state,
            roleplayer: null,
            status: Status.ERROR
        }));
    } else {
        roleplayerModalStore.update((state) => ({
            ...state,
            roleplayer: response.data,
            status: Status.OK
        }));
    }
}

export const createRoleplayer = async (roleplayer: Roleplayer) => {
    roleplayerModalStore.update((state) => ({
        ...state,
        status: Status.LOADING
    }));

    const response = await sbCreateRoleplayer(roleplayer);

    if (response.error != undefined) {
        roleplayerModalStore.update((state) => ({
            ...state,
            roleplayer: null,
            status: Status.ERROR
        }));
    } else {
        roleplayerModalStore.update((state) => ({
            ...state,
            roleplayer: response.data,
            status: Status.OK
        }));
    }
}