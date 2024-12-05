<div class='grid grid-cols-12 py-1 bg-slate-700 justify-between items-center text-center'>
    <div class='bg-slate-700 pl-2 col-span-2 grid grid-rows-4 text-md content-center'>
        <!-- resources -->
        <div class='res-wrapper row-span-1 grid grid-cols-2'>
            <div class='col-span-1 text-orange-200 text-left'>Nectar</div>
            <div class='col-span-1 text-orange-200 text-right'>{
                f(!$genWallet || $genWallet['nectar']==undefined ? '...' : $genWallet['nectar'])}
            </div>
        </div>
        <div class='res-wrapper row-span-1 grid grid-cols-2'>
            <div class='col-span-1 text-fuchsia-300 text-left'>Relics</div>
            <div class='col-span-1 text-fuchsia-300 text-right'>
                {f(!$genWallet || $genWallet['relics']==undefined ? '...' : $genWallet['relics'])}
            </div>
        </div>
        <div class='res-wrapper row-span-1 grid grid-cols-2'>
            <div class='col-span-1 text-blue-300 text-left'>Stardust</div>
            <div class='col-span-1 text-blue-300 text-right'>
                {f(!$genWallet || $genWallet['stardust']==undefined ? '...' : $genWallet['stardust'])}
            </div>
        </div>
        <div class='res-wrapper row-span-1 grid grid-cols-2'>
            <div class='col-span-1 text-lime-300 text-left'>Prisms</div>
            <div class='col-span-1 text-lime-300 text-right'>
                {f(!$genWallet || $genWallet['prisms']==undefined ? '...' : $genWallet['prisms'])}
            </div>
        </div>
    </div>
    <div class='col-span-1'></div>
    <!-- skills (1) -->
    <div class='bg-slate-700 col-span-2 ml-6 grid grid-rows-2 text-md content-center'>
        <div class='res-wrapper row-span-1 grid grid-cols-2'>
            <div class='col-span-1 text-slate-100 text-left'>Mining</div>
            <div class='col-span-1 text-slate-100 text-right'>
                {f($skillLevels==undefined ? '...' : $skillLevels['mining'])}
            </div>
        </div>
        <div class='res-wrapper row-span-1 grid grid-cols-2'>
            <div class='col-span-1 text-slate-100 text-left'>Gathering</div>
            <div class='col-span-1 text-slate-100 text-right'>48</div>
        </div>
        <div class='res-wrapper row-span-1 grid grid-cols-2'>
            <div class='col-span-1 text-slate-100 text-left'>Merchantry</div>
            <div class='col-span-1 text-slate-100 text-right'>52</div>
        </div>
        <div class='res-wrapper row-span-1 grid grid-cols-2'>
            <div class='col-span-1 text-slate-100 text-left'>Spelunking</div>
            <div class='col-span-1 text-slate-100 text-right'>52</div>
        </div>
    </div>
    
    <div class='col-span-1'></div>
    <!-- skills (2) -->
    <div class='bg-slate-700 col-span-2 ml-6 grid grid-rows-2 text-md content-center'>
        <div class='res-wrapper row-span-1 grid grid-cols-2'>
            <div class='col-span-1 text-slate-100 text-left'>Smithing</div>
            <div class='col-span-1 text-slate-100 text-right'>104</div>
        </div>
        <div class='res-wrapper row-span-1 grid grid-cols-2'>
            <div class='col-span-1 text-slate-100 text-left'>Jewelcrafting</div>
            <div class='col-span-1 text-slate-100 text-right'>112</div>
        </div>
        <div class='res-wrapper row-span-1 grid grid-cols-2'>
            <div class='col-span-1 text-slate-100 text-left'>Pet Level</div>
            <div class='col-span-1 text-slate-100 text-right'>27 (25.54%)</div>
        </div>
        <div class='res-wrapper row-span-1 grid grid-cols-2'>
            <div class='col-span-1 text-slate-100 text-left'>Clan Level</div>
            <div class='col-span-1 text-slate-100 text-right'>38 (49.77%)</div>
        </div>
    </div>

</div> 


<script lang='ts'>
    const clanw = 59;
    import {sc} from '../../../lib/data/socket';
    import {onMount, onDestroy} from 'svelte';
    import {genWallet, skillLevels} from '../../../lib/data/player';
    import {f, fp} from '../../../lib/formatting'

    onMount(() => {
        setTimeout(() => {
            $sc.on('connect-fetch-confirm', (data: JSON) => {
                console.log('fetched')
            })

        }, 1000)
    })
</script>