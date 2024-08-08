import { writable } from "svelte/store";
import type { LwpToast } from "../../types";

export const toasts = writable<LwpToast[]>([]);

export const toast = (toast: LwpToast) => {
    toasts.update((state) => [toast, ...state]);
    setTimeout(removeToast, toast.duration ? toast.duration : 3000);
}

const removeToast = () => {
    toasts.update((state) => {
        return [...state.slice(0, state.length - 1)];
    });
}