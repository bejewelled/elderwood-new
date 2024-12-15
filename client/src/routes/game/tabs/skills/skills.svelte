<div class='wrapper'>
    <!-- subtabs for basic and crafting skills -->
    <!-- each button has on:click event to change a subtab variable -->
    <div class='grid grid-cols-2'>
        <button class='bg-gray-700 hover:bg-gray-500 text-white p-2' on:click={() => client.subtab = 'basic'}>Basic</button>
        <button class='bg-gray-700 hover:bg-gray-500 text-white p-2' on:click={() => client.subtab = 'crafting'}>Crafting</button>
    </div>

    <!-- make a dropdown input with basic gathering skills: mining, harvesting, spelunking, logging -->
    <div class='grid grid-cols-2'>
        <select class='bg-gray-600 border-2 border-gray-300 hover:bg-gray-500 text-white p-2' bind:value={client.skills.skill_selected}>
            <option value='mining'>Mining</option>
            <option value='harvesting'>Harvesting</option>
            <option value='spelunking'>Spelunking</option>
            <option value='logging'>Logging</option>
        </select>
        <!-- button to start actions -->
        <button class='bg-gray-700 hover:bg-gray-500 text-white p-2'>Start</button>
    </div>


    
</div>

<script>
// @ts-nocheck

    import { getContext, onMount, setContext } from 'svelte';
    import { client } from '$lib/client.svelte'
    
    client.skills = {}
    client.skills.skills_subtab = 'basic';
    client.skills.skill_selected = 'mining';
    client.actionsActive = false;
</script>