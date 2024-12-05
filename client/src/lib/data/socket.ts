import { writable } from "svelte/store";

export const sc: any = writable();

export const connectInProgress = writable(false);

export const socketTester = writable(1);