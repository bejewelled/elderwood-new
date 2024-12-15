<script>

    // @ts-ignore
    import {onMount, onDestroy, setContext, getContext} from 'svelte';
    import {io} from 'socket.io-client';
    import { client } from '$lib/client.svelte';
    
    onMount(() => {
        const socket = io('http://localhost:3000', {
            upgrade: false,
            transports: ['websocket']
        })
        console.log('socket??')
        console.log(socket)
        socket.on('connect', () => {
            console.log('connected')
        })
        client.socket = socket;
    })

    // @ts-ignore




</script>