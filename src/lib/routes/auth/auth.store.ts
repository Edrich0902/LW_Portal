import { writable } from "svelte/store";
import { supabaseAuth } from "../../services/auth-service";
import { Status, type AuthResponse } from "../../types";

export type AuthStoreModel = {
    status: Status;
    response: AuthResponse;
}

const defaults: AuthStoreModel = {
    status: Status.UNINITIALIZED,
    response: {} as AuthResponse
}

export const authStore = writable<AuthStoreModel>(defaults);

export const authenticate = async (email: string, password: string) => {
    const state: AuthStoreModel = {
        ...defaults,
        status: Status.LOADING
    }
    authStore.set(state)

    const response = await supabaseAuth(email, password);

    authStore.update((state) => ({
        ...state,
        response: response,
        status: Status.OK
    }));
}