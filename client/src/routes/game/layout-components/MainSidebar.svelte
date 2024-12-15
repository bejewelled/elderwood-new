<script>
  import { client } from "$lib/client.svelte";


  const routes = ['Home', 'Skills', 'Combat', 'Inventory', 'Market', 'Empire']

</script>

<!-- this but add on:click to change client.tab to the tab -->
<div class='flex flex-col'>
  {#each routes as route}
    <button class='bg-gray-700 hover:bg-gray-500 text-white p-2' on:click={() => client.tab = route.toLowerCase()}>{route}</button>
  {/each}
</div>

