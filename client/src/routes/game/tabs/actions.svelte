<div class='grid grid-cols-6'>
    <div class='col-span-6 pb-1'>
        {#if !$actionsOn}
            {#each $actionTypes as tab, i}
            <button class={actionTypeSelected == tab ? 'game-btn-small-selected' : 'game-btn-small'}
            on:click={() => changeActionTab(tab)}>{cap(tab)}</button>
            {/each}
        {/if}
    </div>
    {#if (actionTypeSelected == 'mining' || actionTypeSelected == 'gathering')
    && $loaded['area'] && $loaded['rarity']}
    <div class='col-span-6 min-w-[400px]'>
        {#if !$actionsOn}
            <select class='border-2 bg-slate-300 border-slate-700' bind:value={areaSelected} 
            on:change={() => {
                getLevelReq();
                $sc.emit('rarity-values-fetch', {
                    area: areaSelected,
                    actionType: actionTypeSelected
                })
            }}>
                {#if $areasStore}
                {#each Object.keys($areasStore[actionTypeSelected]) as m, i}
                    <option value={m}>Area {i+1} - {cap(m)}</option>     
                {/each}
                {/if}
            </select>
            <div class='py-1'></div>
            <select class='border-2 bg-slate-300 border-slate-700' bind:value={$raritySelectedStore}>
                {#if $rarityNamesStore}
                    {#each $rarityNamesStore as r, i}
                        {#if r == 'Regular'}
                        <option class={$rarityColors[r]} value={r} selected>{r}</option>  
                        {:else}
                        <option class={$rarityColors[r]} value={r}>{r}</option> 
                        {/if}
                    {/each}
                {/if}
            </select>
            {#if $areasStore && areaSelected && $rarityThresholdsStore}
                {#key areaSelected}
                <!-- <div class='py-1 text-black'>Level Recommendation: {lr}</div>
                <div class='pt-1 text-sm text-red-600'>You will receive very few or no resources in zones rated higher than your current profession level.</div> -->
                {/key}
                {#if $raritySelectedStore}
                <div class='{$rarityColors[$raritySelectedStore]} py-1'>Resource: {$raritySelectedStore} {cap(currentResource || '???')}<br/>
                Roll Threshold - {$rarityThresholdsStore[$raritySelectedStore.toLowerCase()]}</div>
                {/if}
                {/if}
            {/if}
            {#if !$actionsOn && !$actionPrep && $areasStore}
                <button class='{actionLoader ? 'game-btn-selected' : 'game-btn'}' 
                on:click={() => startActions(actionTypeSelected)}>
                {actionLoader ? 'Starting...' : 'Start ' + cap(actionTypeSelected)}</button>
            {:else if $actionPrep}
                {#if $actionsOn}
                    
                    <div role="status">
                        {#if $actionPrepReload}
                        Resuming actions... (starting on next tick)
                        {:else}
                        Preparing actions... (starting on next tick)
                        {/if}
                       <LoadingSpinner/>
                        <span class="sr-only">Preparing actions...</span>
                    </div>
                {/if}
            {:else}
            <div>
                <button class='col-span-1
                {$refreshingActions ? 'game-btn-small-disabled' : 'game-btn-small'}'
                on:click={() => refreshActions()}>
                {$refreshingActions ? 'Refreshing...' : 'Refresh Actions'}</button>
                <button class='col-span-1
                {$endingActions ? 'game-btn-small-disabled' : 'game-btn-small'}' on:click={() => endActions()}>{$endingActions ? 'Ending...' : 'End Actions'}</button>
                <span class='pr-1'></span>         
                <br/>
                Current Area: <span class='text-sky-700'>{$currArea}</span>
                <div class='text-md pb-1'>{cap($actionType)} for 
                    <span class={$rarityColors[cap($gains['rarity'] || '')] || 'text-slate-700'}>
                        {$gains['rarity'] === 'regular' ? '' : cap($gains['rarity'] || '')} {cap($gains['resource'] || '')} [{$gains['thresh']}]
                </div>
            </div>
            <div class='min-w-[550px]'>
            <Gains_Main/>
            </div>     
        {/if}
    </div>  
    {:else if (actionTypeSelected == 'merchantry')}
    <button class='{actionLoader ? 'game-btn-selected' : 'game-btn'}' 
    on:click={() => startActions(actionTypeSelected)}>
    {actionLoader ? 'Starting...' : 'Start ' + cap(actionTypeSelected)}</button>
    {:else}
    <div class='col-span-6 text-slate-700'>Loading data... <LoadingSpinner/> </div>
    {/if}
</div>


<style>

</style>

<script lang=ts>
    import {actionType, actionsOn, actionPrep, actionPrepReload,
    refreshingActions, actionsLeft, loaded} from '../../../lib/data/state';
    import {sc} from '../../../lib/data/socket';
    import {onMount, onDestroy} from 'svelte';
    import {currArea, skillXP, masteryXP,
         genWallet, skillWallet, gains} from '../../../lib/data/player';
    import {areasStore, rarityThresholdsStore, 
        rarityNamesStore, raritySelectedStore, rarityColors,
    actionTypes} from '../../../lib/data/game';
    import {endingActions} from '../../../lib/data/flags';
    import LoadingSpinner from '../displays/loadingSpinner.svelte';

    import Gains_Main from '../displays/gains_main.svelte';
    import one from '$lib/images/dice/one.svg';
    import two from '$lib/images/dice/two.svg';
    import three from '$lib/images/dice/three.svg';
    import four from '$lib/images/dice/four.svg';
    import five from '$lib/images/dice/five.svg';
    import six from '$lib/images/dice/six.svg';


    let actionLoader: any = false;
    let actionTypeSelected: string = 'mining'
    let areas: any;
    let areaSelected: string;
    let rarityThresholds: any;
    let actionTab: any = $actionType || 'mining';
    let currentResource;
    $: lr = 0

    const getNumberWord = (n: number) => {
        const vals = ['one', 'two', 'three', 'four', 'five', 'six']
        return vals[n-1]
    }

    const endActions = () => {
        actionLoader = false;
        $endingActions = true;
        $sc.emit('action-end', {})
        setTimeout(() => {
            //console.log('ending actions')
            $actionsOn = false;
            $currArea = ''
            $endingActions = false;

        }, 2000)
    }

    const refreshActions = () => {
        $refreshingActions = true;
        $sc.emit('action-refresh', {})
        
    }

    onMount(() => {
        setTimeout(() => {
            if ($actionType) actionTypeSelected = $actionType
        }, 1500)

        $raritySelectedStore = 'Regular'
        if ($areasStore) $loaded['area'] = true
        if ($rarityThresholdsStore) $loaded['rarity'] = true
        // edge case where actions are prepping but not firing
        $rarityNamesStore = ['Regular', 'Glowing', 'Celestial', 'Radiant',
        'Mythical', 'Ascendant', 'Perfected']

        // if ($actionPrep && !$actionsOn) {
        //     $actionPrep = false
        //     $actionsOn = false
        // }

        $sc.on('action-refresh-confirm', (res: any) => {
            $actionsLeft = res.actionsTotal
        })

        $sc.on('fetch-areas-return', (res: any) => {
            //console.log('gotten mining areas')
            if (res.mining) $areasStore['mining'] = res.mining
            if (res.gathering) $areasStore['gathering'] = res.gathering
            console.log($areasStore)
            areaSelected = Object.keys($areasStore[actionTypeSelected || 'mining'])[0];
            $loaded['area'] = true
            $sc.emit('rarity-values-fetch', {
                actionType: actionTypeSelected,
                area: areaSelected
            })
        })

        $sc.on('rarity-values-return', (data: any) => {
            currentResource = data.resource
            //console.log('gotten rarity values')
            rarityThresholds = data.rarityThresholds
            $rarityThresholdsStore = rarityThresholds
            $rarityNamesStore = data.rarityNames
            if (!$raritySelectedStore) $raritySelectedStore = 'Regular'
            //console.log($rarityNamesStore)
            $loaded['rarity'] = true

        })


        setTimeout(() => {
            $sc.emit('fetch-areas', {})
        }, 300)
        if ($areasStore) {
            $sc.emit('rarity-values-fetch', {
                area: areaSelected
            })
        } else {
            setTimeout(() => {
                $sc.emit('rarity-values-fetch', {
                    area: areaSelected
                })
            }, 320)
        }
    })


    onDestroy(() => {
        $sc.off('fetch-areas-return')
        $sc.off('rarity-values-return')
    })

    const getLevelReq = () => {
        if (areas) {
            //console.log('oop')
            lr = areas[areaSelected]['levelReq']
        } 
    }

    const changeActionTab = (type: string) => {
        if (actionTypeSelected == type) return;
        actionTypeSelected = type;
        if (actionTypeSelected == 'merchantry') {
        } else {
            const a1 = Object.keys($areasStore[type])[0]
            currentResource = $areasStore[type][a1]['resource']
            $sc.emit('rarity-values-fetch', {
                actionType: type,
                area: a1
            })
            areaSelected = Object.keys($areasStore[actionTypeSelected || 'mining'])[0];
        }


    }

    const startActions = (type: string) => {
            if (actionLoader) return;
            else actionLoader = true;
            $actionType = type;
            $actionPrep = true;
            $sc.emit('action-end', {type: type})
            if (type == 'mining' || type == 'gathering') {
                $currArea = areaSelected;
                $sc.emit('action-start', {
                    actionType: type,
                    area: areaSelected,
                    rarity: $raritySelectedStore
                })
            } else if (type == 'merchantry') {
                $sc.emit('action-start', {
                    actionType: type,
                    area: null,
                    rarity: null
                })
            }
            setTimeout(() => {
                //console.log(areaSelected)
                $sc.emit('action-start', {
                    actionType: $actionType,
                    area: areaSelected,
                    rarity: $raritySelectedStore
                })
            }, 170)
            // "confirm" actions sent from server
           
        }

const cap = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

onDestroy(() => {
    if ($actionPrep && !$actionsOn) {
        endActions();
        $actionPrep = false
        $actionsOn = false
    }
})
</script>