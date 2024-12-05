<div class='grid grid-cols-4'>
    {#each Object.keys($marketViewedItem) as mv}
    <div class='col-span-1'>
        <select class="p-2 border h-[33px] game-btn w-50" 
        bind:value={$marketViewedItem[mv]} on:change={() => {
            changeCategory(mv)
            filterListings($marketViewedItem[mv], true)
            }} placeholder='{cap(mv)}'>
            <option class='game-btn-small' value="{cap(mv)}" disabled selected>{cap(mv)}</option>
            {#each $resourceNames[mv] as r}
                <option class='game-btn-small' value={r}>{cap(mv)}: {cap(r)}</option>
            {/each}
        </select>
    </div>
    {/each}
</div>
{#if $marketViewedItem[$marketCategory||'']}
    <div class='w-full py-1 font-bold'>Viewing: 
        <span class='{$rarityColors[$marketViewedItem[$marketCategory]
        .slice(0, $marketViewedItem[$marketCategory].indexOf(' '))] || 'text-slate-700'}'>
            {cap($marketViewedItem[$marketCategory])}
        </span>
    </div>
    <div class='grid grid-cols-6 border-b border-slate-300 text-slate-700'>
        <div class='col-span-1'>You have 
            <span class='font-bold text-slate-600'>
                {f($wallets[$marketCategory][getDBName($marketViewedItem[$marketCategory])] || 0)}.
            </span>
        </div>
        {#if $wallets[$marketCategory][getDBName($marketViewedItem[$marketCategory])] > 0}
            <div class='col-span-5 mb-1'>
                <form on:submit|preventDefault={() => makeListing()}>
                <span class='px-1'>
                    <label for="numericInput2" class='mr-1'>Quick List </label>
                    <input class='border-[1px] border-slate-700 bg-slate-300 ml-2 px-1 w-28' 
                    type="number" id="numericInput2" name="numericInput2" 
                    bind:value={quantity} on:input={() => checkQty(quantity)}>
                </span>
                <span class='px-1'>
                    <input class='accent-slate-700' 
                    type="range" id="rangeInput" name="rangeInput" 
                    bind:value={quantity} min="0" 
                    max="{$wallets[$marketCategory][getDBName($marketViewedItem[$marketCategory])]}">
                </span>
                <span class='px-1'>  
                    <label class='mr-1' for="numericInput1"> @ </label>
                    <input class='border-[1px] border-slate-700 bg-slate-300 ml-2 px-1 w-28' 
                    type="number" id="numericInput1" name="numericInput1"
                    bind:value={cost} min="1" step='0.01' placeholder="1"
                    on:input={() => checkCost(cost)} >
                    <label class='ml-1' for="numericInput1"> each</label>
                </span>
                <span class='px-1'>    
                    <button type="submit" 
                    class='{quantity <= 0 || cost <= 0 
                    ? 'game-btn-selected' : 'game-btn'}'>
                    List</button>
                </span>
                </form>
            </div>
            <div class='col-span-1'></div>
        {/if}
    </div>
    <table class='border-collapse'>
        <thead class='text-left mx-2'>
            <tr class=''>
                <th class='font-bold min-w-[130px]'>Seller</th>
                <th class='font-bold min-w-[130px]'>Cost</th>
                <th class='font-bold min-w-[130px]'>Quantity</th>
                {#if !$loaded['market']}
                    <th class=' text-red-700'>
                        [Processing changes...]
                    </th>
                {:else}
                    <th>
                        Buy Items
                    </th>
                {/if}
                <th colspan='2'>  &nbsp; </th>
            </tr>
        </thead>
        <tbody>
            
            {#if displayedListings.length == 0}
                <tr>
                    <td class='text-slate-700'>No listings found.</td>
                </tr>
            {:else}
                {#each displayedListings as l, i}
                    {#if i >= (page-1)*maxPerPage && i < page*maxPerPage}
                        <tr class='min-h-[33px] border-b border-t border-slate-300'>
                            <td class='border-r min-w-[130px]'>{l.sellerUsername}</td>
                            <td class='border-r min-w-[130px]'>{f(l.cost, 2) }</td>
                            <td class='border-r min-w-[130px]'>{f(l.quantity)}</td>
                            {#if buyInProgressIndex >= 0 && i === buyInProgressIndex}
                            <td>
                                <input class='max-w-[80px] 
                                border-[1px] border-slate-700 bg-slate-300 px-1' type='number' 
                                bind:value={buyQuantity}
                                max="94"
                                on:input={() => {
                                    canAffordCheck(l.cost, l.quantity)
                                    checkBuyQty(buyQuantity, l.quantity)
                                }}/>
                               
                            </td>
                            {:else}
                                {#if l.sellerUsername != $username}
                                    <button class='
                                    {!$loaded['market'] ? 'game-btn-small-disabled' : 'game-btn-small'} 
                                    col-span-1 mx-3 self-start'
                                    on:click={() => toggleBuyInProgress(i)}>Buy</button>
                                {:else if l.sellerUsername == $username}
                                    <button class='
                                    {!$loaded['market'] ? 'game-btn-small-disabled' : 'game-btn-small'} 
                                    col-span-1 mx-3 self-start'
                                    on:click={() => removeListing(l)}>Remove</button>
                                {/if}
                            {/if}
                            <td>
                                <button class='
                                {canAfford ? 'game-btn-small' : 'game-btn-small-disabled'}
                                {buyInProgressIndex >= 0 && i === buyInProgressIndex ? 
                                'visible' : 'hidden'}
                                mx-1 self-start'
                                on:click={() => purchaseListing(l)}>Confirm - {f(l.cost*buyQuantity)} nectar</button>
                            </td>
                         
                        </tr>
                    {/if}
                {/each}
            {/if}
        </tbody>
    </table>

    {#if displayedListings.length > maxPerPage}
        <div class='w-full py-1'>
            <button class='game-btn-small' on:click={() => page = Math.max(1, page-1)}>Prev</button>
            <button class='game-btn-small' on:click={() => page = Math.min(Math.ceil(displayedListings.length/maxPerPage), page+1)}>Next</button>
        </div>
    {/if}
{/if}

<div class='info-text text-red-700 text-xs'>
    Posting multiple orders for the same resource will use the price of the most recent order.
</div>



<script lang='ts'>

    import {sc} from '../../../lib/data/socket';
    import {onMount, onDestroy} from 'svelte';
    import {loaded, tab, invTab, invResTab, actionType} from '../../../lib/data/state';
    import {marketListings, marketRefreshTimer, 
        resourceNames, rarityColors, 
        marketCategory, marketViewedItem, marketIsResource} from '../../../lib/data/game'
    import {wallets, gatheringWallet, merchantryWallet, 
        genWallet, formattedInvWallet, username, userID} from '../../../lib/data/player';
    import {f, fp, cap} from '../../../lib/formatting';
    import LoadingSpinner from '../displays/loadingSpinner.svelte';


    let page = 1;
    let maxPerPage = 15;
    let quantity = 0;
    let cost = 0;
    let displayedListings: Array<object> = [];
    let buyInProgressIndex = -1
    let buyQuantity = 0;
    let canAfford = false;

    onMount(() => {
        displayedListings = filterListings($marketViewedItem[$marketCategory], $marketIsResource)
        $sc.emit('fetch-resource-names', {
            type: 'all'
        })
        $sc.on('fetch-all-market-listings-return', (res: any) => {
                
                $marketListings = res.listings;
                displayedListings = filterListings($marketViewedItem[$marketCategory], $marketIsResource)
                $loaded['market'] = true;
            })
        $sc.on('create-market-listing-return', (res: any) => {
                $marketListings = res.listings;
                displayedListings = filterListings($marketViewedItem[$marketCategory], $marketIsResource)
                $loaded['market'] = true;
            })
        $sc.on('purchase-market-listing-return', (res: any) => {
                $marketListings = res.listings;
                displayedListings = filterListings($marketViewedItem[$marketCategory], $marketIsResource)
                $loaded['market'] = true;
            })
        $sc.on('remove-market-listing-return', (res: any) => {
                $marketListings = res.listings;
                displayedListings = filterListings($marketViewedItem[$marketCategory], $marketIsResource)
                $loaded['market'] = true;
            })
        if (Date.now() > $marketRefreshTimer) {
            $sc.emit('fetch-all-market-listings', {})
             // 5s cooldown on db fetching since it's a costly operation
            $marketRefreshTimer = Date.now() + 10000; 
        }
        $sc.emit('get-all-wallets', {})


    })

    onDestroy(() => {
        $sc.off('fetch-all-market-listings-return')
        $sc.off('create-market-listing-return')
        $sc.off('purchase-market-listing-return')
    })

    const makeListing = () => {
            if (quantity <= 0 || cost <= 0) return;
            $sc.emit('create-market-listing', {
                category: $marketCategory,
                item: getDBName($marketViewedItem[$marketCategory]),
                quantity: quantity,
                cost: cost,
                skill: $marketCategory,
            })
            if ($marketIsResource) {
                $wallets[$marketCategory.toLowerCase()][getDBName($marketViewedItem[$marketCategory])] -= Math.min(
                    quantity, $wallets[$marketCategory.toLowerCase()][getDBName($marketViewedItem[$marketCategory])]);
            }

            setTimeout(() => {
                $loaded['market'] = false;
                quantity = 0
                cost = 0
                $sc.emit('get-all-wallets', {})
            }, 20)

            console.log($marketListings)
    }

    const purchaseListing = (l: object) => {
        if (!$loaded['market']) return;
        const finalQty = checkBuyQty(buyQuantity, l['quantity'])
        console.log('buying quantity of ' + finalQty)
        if (buyQuantity <= 0) return;
        if ($genWallet && ($genWallet['nectar'] || 0) < l['cost']*buyQuantity) return;
        $sc.emit('purchase-market-listing', {
            listing: l,
            buyQuantity: finalQty,
        })
        $sc.emit('get-all-wallets', {})
        buyQuantity = 0;
        buyInProgressIndex = -1;

        setTimeout(() => {
            $loaded['market'] = false;
        }, 20)
    }

    const removeListing = (l: object) => {
        $sc.emit('remove-market-listing', {
            listing: l,
        })
        $sc.emit('get-all-wallets', {})
        setTimeout(() => {
            $loaded['market'] = false;
        }, 20)
    }


    const checkQty = (v: number) => {
        console.log(v)
        if (v < 0) quantity = 0;
        if (v > $wallets[$marketCategory][getDBName($marketViewedItem[$marketCategory])]) 
            quantity = $wallets[$marketCategory][getDBName($marketViewedItem[$marketCategory])];
        quantity = Math.floor(quantity)
    }

    const checkBuyQty = (v: number, m: number) => {
        console.log(v)
        if (v < 0) buyQuantity = 0;
        if (v > m) 
            buyQuantity = m;
        buyQuantity = Math.floor(buyQuantity)
        return buyQuantity;
    }

    const checkCost = (v: number) => {
        if (v < 0) cost = 0;
    }
    
    const getDBName = (item: string) => {
        return item.toLowerCase().replace(' ', '');
    }

    const toggleBuyInProgress = (i: number) => {
        console.log(i)
        buyInProgressIndex = i;
    }

    const canAffordCheck = (cost: number, qty: number) => {
        console.log(buyQuantity)
        const nectar = ($genWallet ? $genWallet['nectar'] || 0 : 0)
        canAfford = (Math.floor(nectar) >= Math.floor(cost*qty))
    }

    const changeCategory = (cat: string) => {
        $marketCategory = cat;
        if (cat != 'mining') $marketViewedItem['mining'] = 'Mining'
        if (cat != 'gathering') $marketViewedItem['gathering'] = 'Gathering'
        if (cat == 'mining' || cat == 'gathering') {
            $marketIsResource = true;
        }
       // console.log(cat + " " + $marketCategory)
        //console.log($wallets)
    }

    const filterListings = (itemName: string, isResource:boolean) => {
        const name = getDBName(itemName);
        const allListings: Array<object> = JSON.parse(JSON.stringify($marketListings));
        let listings = allListings.filter((listing: any) => {
            return listing['item'] == name;
        })
        displayedListings = listings;
        return listings;
    }
</script>

<style>
    .table-spacer {
        border-collapse: separate;
        border-spacing: 2rem 0;
    }
</style>