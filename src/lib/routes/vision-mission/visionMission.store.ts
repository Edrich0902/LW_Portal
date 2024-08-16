import { get, writable } from "svelte/store";
import { Status, type VisionMission } from "../../types";
import { sbQueryVisionMission, sbUpdateVisionMission } from "../../services/vision-mission-service";

export type VisionMissionStoreModel = {
    status: Status;
    data: VisionMission[];
}

const defaults: VisionMissionStoreModel = {
    status: Status.UNINITIALIZED,
    data: [],
}

export const visionMissionStore = writable<VisionMissionStoreModel>(defaults);

export const initVisionMission = async () => {
    const state: VisionMissionStoreModel = {
        ...defaults,
        status: Status.LOADING,
    }

    visionMissionStore.set(state);

    await queryVisionMission();
}

export const queryVisionMission = async () => {
    visionMissionStore.update((state) => ({
        ...state,
        status: Status.LOADING,
    }));

    const response = await sbQueryVisionMission();

    visionMissionStore.update((state) => ({
        ...state,
        data: response.data,
        status: Status.OK,
    }));
}

export const updateVisionMission = async (visionMission: VisionMission[]) => {
    visionMissionStore.update((state) => ({
        ...state,
        status: Status.LOADING,
    }));

    const response = await sbUpdateVisionMission(visionMission);

    if (response.error != undefined) {
        visionMissionStore.update((state) => ({
            ...state,
            data: [],
            status: Status.ERROR
        }));
    } else {
        visionMissionStore.update((state) => ({
            ...state,
            data: response.data,
            status: Status.OK
        }));
    }
}