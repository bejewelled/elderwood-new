<script>
    import '../app.css';
    let { children } = $props();
</script>

<div class='dark:bg-gray-700 dark:text-white'>
{@render children()}
</div>