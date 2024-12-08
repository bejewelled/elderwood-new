
{x}

<script>
    import {setContext, onMount, onDestroy} from 'svelte'
    import {io} from 'socket.io-client'
    const socket = io('http://localhost:3000', {
            transports: ['websocket']
    })
    
    let x = $state('hi')
    setContext('socket', socket);

    onMount(() => {
        socket.emit('test')

        socket.on('test-back', () => {
            console.log('done')
            x = 'tested!';
        })
    })
    
</script>
