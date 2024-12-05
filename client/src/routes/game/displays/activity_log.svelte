{#if $tab !== 'actions'}
<div class='grid grid-cols-1 border-2 border-slate-700 h-[270px]'>
    <div class=' m-1 max-h-[270px] overflow-y-auto'>

        <div class='font-bold text-lg'>Current Action</div>
        <Gains_Alog />
    </div>
</div>
{/if}


<script lang='ts'>
    import {sc} from '../../../lib/data/socket'
    import {activityLog} from '../../../lib/data/game'
    import {gains} from '../../../lib/data/player'  
    import {tab} from '../../../lib/data/state'
    import {onMount, onDestroy} from 'svelte'
    import Gains_Alog from './gains_alog.svelte';

    let message = ''

    onMount(() => {
        $sc.on('connect', () => {
            
        })

    })

</script>

