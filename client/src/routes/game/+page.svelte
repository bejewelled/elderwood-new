<div class='wrapper'>
</div>
{#if $sc}
<div class='wrapper'>
    {#if $tab === 'home'}
        <Home />
    {:else if $tab === 'actions'}
        <Actions />
    {:else if $tab === 'inventory'}
        <Inventory />
    {:else if $tab === 'market'}
        <Market />
    {/if}
</div>
{/if}

<!-- 
<div class='user-display w-full p-0 m-0'>
    Your username is: {user}
    <br/>

    <button class='test border-2 py-1 border-gray-300 
    {actionsOn ? 'bg-red-300' : 'bg-green-300'}' on:click={testAction}>
        CLICK TO {actionsOn ? 'END' : 'START'}
    </button>
    <button class='test border-2 border-gray-300 bg-orange-300' on:click={logout}>
        LOGOUT
    </button>
    <div class='test'>test status: {user}</div>
</div> -->

<script lang="ts">
    import axios from 'axios';
    import {goto} from '$app/navigation';
    export let data;
    import {io} from 'socket.io-client'
    import {sc} from '../../lib/data/socket'
    import {tab} from '../../lib/data/state'
    import Actions from './tabs/actions.svelte';
    import Home from './tabs/home.svelte';
    import Inventory from './tabs/inventory.svelte';
    import Market from './tabs/market.svelte';

    $: user = ''
    let actionsOn = false;

    import {onMount, onDestroy} from 'svelte';


    onMount(() => {
        const socket = io('http://localhost:3000', {
                    transports: ['websocket']
                })
        $sc = socket;
        setTimeout(() => {
            try {
            
                console.log('socket created')

                $sc.on('connect-test-confirm', (data: JSON) => {
                    console.log(data)
                })

                $sc.on('connect', () => {
                    console.log('connected to socket!')
                    console.log('emitting connection event')
                    $sc.emit('connect-test', {})
                    console.log('joining chat...')
                    setTimeout(() => {
                        $sc.emit('join-chat', {})
                    }, 300)
                })

                $sc.on('logout', () => {
                    logout();
                })
                
                $sc.on("connect_error", (err: any) => {
                    console.log(`connect_error due to ${err.message}`);
            //console.log(err)
                });
                getInfo().then((data) => {
                    user = data.username
                })
        } catch (err) {
            console.log(err)
        }
        }, 1000)
    })


    const testAction = () => {
        if (actionsOn) {
            actionsOff()
            return;
        }
        actionsOn = true
        $sc.emit('action-start', {})
    }

    let emitter: any;
    const actions = () => {
        emitter = setInterval(() => {
            console.log('testing...')
            $sc.emit('action', {action: 'test'})
        }, 1000)
    }

    const actionsOff = () => {
        actionsOn = false
        $sc.emit('action-end', {})
        clearInterval(emitter)
    }

    onDestroy(() => {
        if ($sc) $sc.disconnect()
        clearInterval(emitter)
    })

    const getInfo = async () => {
        const user_info = await axios.get('http://localhost:3000/get_user', {withCredentials: true});
        if (user_info.data.err === 'nosession') {
            console.log('no authorization')
            goto('/login')
        }
        if (user_info.data.err === 'noauth') {
            console.log('no authorization')
            goto('/login')
        }
        return {
            username: user_info.data.username,
        };
    }

    const logout = async () => {
        const logout = await axios.get('http://localhost:3000/logout', {withCredentials: true});
        goto('/login')
    }
</script>