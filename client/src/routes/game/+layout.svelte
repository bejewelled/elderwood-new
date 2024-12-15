<script>
let { children } = $props();

import { getContext, onMount, setContext } from 'svelte';
import { client } from '$lib/client.svelte'


import Socket from '../../engines/socket.svelte';
import MainSidebar from './layout-components/MainSidebar.svelte';
import CurrencyDisplay from './layout-components/CurrencyDisplay.svelte';
onMount(() => {
    setTimeout(() => {
        client.tab = 'skills';
    }, 1000)
    // console.log('layout mounted');
    // state = getContext('state');
    // console.log(state)
})

</script>

<Socket />
<div class='wrapper p-1 w-full h-full border-2 border-black text-md'>
    <div class='grid grid-rows-7'>  
        <!-- currency/xp -->
        <div class='row-span-3'>
            <div class='grid grid-cols-9'>
                <div class='col-span-1'>
                    <CurrencyDisplay />
                </div>
            </div>
        </div>
        <!-- header -->
        <div class='row-span-1'>
        </div>
        <div class='row-span-4'>
            <!-- main content -->
            <div class='grid grid-cols-12'>
                <!-- sidebar -->
                <div class='col-span-2'>
                <MainSidebar />
            </div>
                <div class='col-span-8'>
                    {@render children()}
                    {#each Object.keys(client || {}) as key}
                        <p>{key}: {client[key]}</p>
                    {/each}
                    <!-- each client.skills -->
                    {#each Object.keys(client.skills || {}) as key}
                        <p>{key}: {client.skills[key]}</p>
                    {/each}
                </div>
            </div>

            </div>
        </div>
        <div class='row-span-2'>
            Chat
        </div>
</div>
