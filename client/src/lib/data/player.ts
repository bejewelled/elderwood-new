import { writable } from "svelte/store";

export const userID = writable('');
export const username = writable('');

export const genWallet = writable({
    nectar: 0,
    relics: 0,
    stardust: 0,
    prisms: 0
});

export const skillWallet= writable({});

export const wallets = writable({
    mining: {},
    gathering: {},
})
export const gatheringWallet= writable({});
export const merchantryWallet= writable({});

export const formattedInvWallet: any = writable([]);

export const gengains= writable({});
export const skillgains= writable({});

export const skillLevels = writable({
    mining: 0,
    gathering: 0,
    merchantry: 0
})


export const masteryXP = writable({
    level: 0,
    xp: 0,
    xpNext: 500
});

export const skillXP = writable({
    level: 0,
    xp: 0,
    xpNext: 1000,
    skillBonus: 0
});

export const allLevels= writable({});

export const currArea= writable('');

export const gains = writable({});