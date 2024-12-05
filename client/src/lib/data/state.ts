import { writable } from "svelte/store";

export const tab: any= writable('home');

export const lastAction: any = writable(new Date());

export const actionsOn: any= writable(false);
export const actionPrep: any = writable(true);
export const actionPrepReload: any = writable(false);
export const actionType: any = writable('')

export const actionsLeft: any = writable(0);

export const refreshingActions: any = writable(false);

export const invTab: any = writable('mining');
export const invResTab: any = writable('mining');

export const loaded = writable({
    area: false,
    rarity: false,
    market: true
})