<div class='flex flex-col'>
    <button class='game-btn' on:click={() => changeTab('home')}>Home</button>
    <button class='game-btn' on:click={() => changeTab('actions')}>Actions</button>
    <button class='game-btn' on:click={() => changeTab('inventory')}>Inventory</button>
    <button class='game-btn' on:click={() => changeTab('market')}>Market</button>
    <button class='game-btn'>Devotions</button>
    <button class='game-btn'>Settlement</button>
    <button class='game-btn'>Guild Hall</button>
    <button class='game-btn'>Prism Shop</button>
</div>

<script lang='ts'>
    import {onMount} from 'svelte';
    import {tab} from '../../../lib/data/state';
    import Actions from '../tabs/actions.svelte';
    import Home from '../tabs/home.svelte';

    const changeTab = (item: any) => {
        tab.set(item);
    }
</script>