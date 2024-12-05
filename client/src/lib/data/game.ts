import { readable, writable } from "svelte/store";

export const areasStore = writable({
    mining: {},
    gathering: {},
    spelunking: {},
    merchantry: {},
    merchantry:{},
});
export const rarityThresholdsStore = writable(undefined);
export const rarityNamesStore = writable([]);
export const raritySelectedStore = writable('regular');

export const actionTypes = writable(['mining', 'gathering', 'merchantry', 'spelunking']);

export const rarities = writable(['regular', 'glowing', 'celestial', 'radiant',
'mythical', 'ascendant', 'perfected'])

export const messages: any = writable([]);
export const activityLog: any = writable([]);

export const rarityColors = writable({
    Regular: 'text-black',
    Glowing: 'text-sky-500',
    Celestial: 'text-fuchsia-500',
    Radiant: 'text-yellow-500', 
    Mythical: 'text-green-400',
    Ascendant: 'text-amber-600',
    Perfected: 'text-red-600',
    regular: 'text-black',
    glowing: 'text-sky-500',
    celestial: 'text-fuchsia-500',
    radiant: 'text-yellow-500', 
    mythical: 'text-green-400',
    ascendant: 'text-amber-600',
    perfected: 'text-red-600',
})

export const genWalletColors = writable({
    nectar: 'text-amber-300',
    relics: 'text-fuchsia-400',
    stardust: 'text-sky-400',
    prisms: 'text-lime-500'

})

export const proficiencyValues = readable([
        0, 2500, 15000, 75000, 300000, 1000000, 
        3000000, 6000000, 10000000, 15000000
])

export const marketListings = writable([

]);

export const marketRefreshTimer = writable(0);

export const resourceNames = writable({
    mining: [],
    gathering: [],
    merchantry: [],
    gen: []
})

export const marketCategory: any = writable('mining');
export const marketViewedItem: any = writable({
    mining: '',
    gathering: '',
});
export const marketIsResource: any = writable(true);