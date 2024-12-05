<div class='grid grid-cols-7 content-center'>
    <!-- subtabs -->
    <div class='col-span-1'>
            <select class="p-2 border h-[33px] game-btn-small" bind:value={resTab} on:change={() => {
                changeTab('Resources')
                changeResTab(resTab)
                }}>
                <option value="" disabled selected>Resources</option>
                <option class='game-btn' value="Mining">Mining</option>
                <option value="Gathering">Gathering</option>
                <option value="Spelunking">Spelunking</option>
            </select>
    </div>
    <div class='col-span-1'>
        <button class='{$invTab == 'Runes' ? 
        'game-btn-small-selected' : 'game-btn-small'} h-[33px] min-w-[99px]' on:click={() => changeTab('Runes')}>Runes</button>
    </div>   
    <div class='col-span-1'>
        <button class='{$invTab == 'Jewels' ? 
        'game-btn-small-selected' : 'game-btn-small'} h-[33px] min-w-[99px]' on:click={() => changeTab('Jewels')}>Jewels</button>
    </div>   
    <div class='col-span-1'>
        <button class='{$invTab == 'Items' ? 
        'game-btn-small-selected' : 'game-btn-small'} h-[33px] min-w-[99px]' on:click={() => changeTab('Items')}>Items</button>
    </div>     

    <div class='col-span-6'></div>

    <div class='col-span-12 py-3'></div>
</div>
    <div class='grid grid-cols-12 mt-3 content-right'>
        <div class='col-span-1'></div>
        <div class='col-span-10'>
            <InvResDisplay tab={$invTab} skill={$invResTab}/>
        </div>
    </div>

<script lang='ts'>
    import {onMount, onDestroy} from 'svelte';
    import {tab, invTab, invResTab, actionType} from '../../../lib/data/state';
    import {wallets, gatheringWallet, 
        merchantryWallet, genWallet, formattedInvWallet} from '../../../lib/data/player';
    import {sc} from '../../../lib/data/socket';
    import {rarityColors, rarities} from '../../../lib/data/game';
    import Actions from '../tabs/actions.svelte';
    import Home from '../tabs/home.svelte';
    import InvResDisplay from '../displays/inv/invResDisplay.svelte';
    import {f, fp, cap} from '../../../lib/formatting';
    import {updateInventory} from '../../../lib/data/flags';

    let resTab: string;

    let currWallet = {}
    let currWalletNoTotals = {}
    let currWalletResUnformatted: Array<String> = []
    let currWalletResources: Array<string> = []
    let formattedWallet: Array<String> = []

    onMount(() => {
        $invTab = 'Resources';
        changeResTab('mining')
        $sc.emit('get-all-wallets',{})

        $sc.on('update-tab-ui', (data: JSON) => {
                switchWallets()
                currWalletNoTotals = removeTotals(currWallet)
                currWalletResources = getResNames(currWalletNoTotals)
                $formattedInvWallet = getWalletDisplay(currWalletNoTotals)
        })
    })

    const changeTab = (item: any) => {
        $invTab = item;
        // $sc.emit('get-inv-values', {
        //         actionType: $invResTab.toString().toLowerCase()
        //     })
    }

    const switchWallets = () => {
        console.log($invResTab)
        switch($invResTab.toLowerCase()) {
            case 'mining':
                if (!$wallets['mining']) $sc.emit('get-all-wallets', {})
                currWallet = $wallets['mining'];
                break;
            case 'gathering':
                if (!$wallets['gathering']) $sc.emit('get-all-wallets', {})
                currWallet = $wallets['gathering']
                break;
            case 'merchantry':
                currWallet = $merchantryWallet;
                break;
            default:
                currWallet = $wallets['mining'];
                break; 
        }
        currWalletNoTotals = removeTotals(currWallet)
        currWalletResources = getResNames(currWalletNoTotals)
        $formattedInvWallet = getWalletDisplay(currWalletNoTotals)
        console.log(currWallet)
        console.log(currWalletResources)

    }
    
    const changeResTab = (item: any) => {
        $invResTab = item;
        switchWallets()
    }


    onDestroy(() => {
        $sc.off('get-inv-values-return');
        $sc.off('update-tab-ui')
    })

    const getWalletDisplay = (wallet: object) => {
        let res: Array<string> = [];
        res = ['', 'Regular', 'Glowing', 'Celestial', 'Radiant', 
        'Mythical', 'Ascendant', 'Perfected'];
        // go through each resource
        for (const r of Array.from(new Set(currWalletResources))) {
            let resObject = filterObject(currWalletNoTotals, r)
            res.push(cap(r))
            // go through each rarity
            for (const rarity of $rarities) {
                let rarityObject: object = {}
                if (rarity.toLowerCase() == 'regular') 
                    rarityObject['regular'+r] = resObject[r]
                else {
                    rarityObject = filterObject(resObject, rarity)
                }
                res.push(rarityObject[rarity+r])
            }
        }
        return res;
    }

    const getResNames = (wallet: object) => {
        let res: Array<string> = [];
        for (const s of Object.keys(wallet)) {
            if (s.includes('glowing')) {
                res.push(s.slice(7));
            }
            else if (s.includes('celestial')) {
                res.push(s.slice(9));
            }
            else if (s.includes('radiant')) {
                res.push(s.slice(7));
            }
            else if (s.includes('mythical')) {
                res.push(s.slice(8));
            }
            else if (s.includes('ascendant')) {
                res.push(s.slice(9));
            }
            else if (s.includes('perfected')) {
                res.push(s.slice(9));
            }
        }
        return res;
    }

    const filterObject = (wallet: object, prefix: string) => {
        const filteredObject = Object.keys(wallet)
            .filter(key => key.includes(prefix))
            .reduce((result, key) => {
            result[key] = wallet[key];
            return result;
            }, {});

        return filteredObject;
    }

    const removeTotals = (wallet: object) => {
        const filteredObject = Object.keys(wallet)
            .filter(key => !(key.toLowerCase().includes('total')))
            .reduce((result, key) => {
            result[key] = wallet[key];
            return result;
            }, {});

        return filteredObject;
}

    const format = (s: string) => {
        if (!s) return '';
        const index = Math.max(
            s.toString().indexOf('glowing'),
            s.toString().indexOf('celestial'),
            s.toString().indexOf('radiant')
        )
        if (index === -1) return cap(s);
        else {
            let prefix: string, res: string;
            if (s.includes('glowing')) {
                prefix = 'glowing';
                res = s.slice(7);
            }
            else if (s.includes('celestial')) {
                prefix = 'celestial';
                res = s.slice(9);
            }
            else if (s.includes('radiant')) {
                prefix = 'radiant';
                res = s.slice(7);
            }
            return `${cap(prefix)} ${cap(res)}`;
        }
    }

</script>
