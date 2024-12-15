{#if client.tab === 'skills'}
<Skills/>
{/if}



<script>
    import Skills from './tabs/skills/skills.svelte';
    import {client} from '$lib/client.svelte';

</script>