<div class='grid grid-cols-8'>
    {#if $invTab == 'Resources'}
        <div class='col-span-8 text-lg font-bold pb-2 text-slate-700'>Resources: {cap($invResTab)}</div>
        {#key $formattedInvWallet}
        {#each $formattedInvWallet as w, i}
            <div class='col-span-1 border-slate-700 text-center {i%8 < 2 ? 'text-slate-700' 
            : $rarityColors[$rarities[(i%8)-1].toString()] || 'text-slate-300'}'>
                <div class='text-sm font-bold'>
                    {#if i > 0}
                        {!isNaN(Number(w)) ? f(Number(w)) : w}
                    {/if}
                </div>
            </div>
            <!-- {#if i % 8 == 7}
                <div class='col-span-1'></div>
            {/if} -->
        {/each}
        {/key}
    {/if}
</div>


<script lang="ts">
    export let skill: string;
    export let tab: string;
    import {sc} from '../../../../lib/data/socket';
    import {wallets, gatheringWallet, merchantryWallet} from '../../../../lib/data/player';
    import {rarityColors, rarities} from '../../../../lib/data/game';
    import {onMount, onDestroy} from 'svelte';
    import {invResTab, invTab} from '../../../../lib/data/state';
    import {f, fp, cap} from '../../../../lib/formatting';
    import {formattedInvWallet} from '../../../../lib/data/player';

    let currWallet = {}
    let currWalletNoTotals = {}
    let currWalletResUnformatted: Array<String> = []
    let currWalletResources: Array<string> = []
    let formattedWallet: Array<String> = []


</script>