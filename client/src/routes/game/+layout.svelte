<!-- layout includes the headers and sidebars -->
<svelte:head>
    <title>Elderwood [{f(actions || '...')}]</title>
</svelte:head>

<!-- engine -->
<Engine/>


<!-- header -->
<body class='w-[99.5%] content-center p-0 m-1'>

<div class='grid grid-cols-10 py-1'>
    <div class='col-span-10'>
        <div class='w-full'>
            <Navbar/>
        </div>
        <div class='w-full'>
            <Res_Levels/>
        </div>
        <div class='w-full'>
            <Levels/>
        </div>
    </div>
</div>
<div class='grid grid-cols-12 min-h-[450px]'>

        <div class='col-span-1'>
            <Sidebar/>
        </div>
        <div class='col-span-9 min-h-[550px] mx-2 my-1'>
            <slot/>
        </div>
        <div class='col-span-2 pr-1'>
            <ActivityLog />
        </div>


</div>
<div class='chat pt-1'>
    <Chat/>
</div>



</body>

<script lang="ts">
    import axios from 'axios';
    import {goto} from '$app/navigation';
    import {onMount} from 'svelte';
    import Sidebar from './displays/sidebar.svelte';
    import Navbar from './displays/navbar.svelte';
    import Res_Levels from './displays/res_levels.svelte';
    import Levels from './displays/levels.svelte';
    import Engine from './engine/engine.svelte';
    import Chat from './displays/chat.svelte';
    import ActivityLog from './displays/activity_log.svelte';
    import {f, fp} from '../../lib/formatting';
    import {actionsOn, actionsLeft, loaded} from '../../lib/data/state';
    import {sc} from '../../lib/data/socket';

    let actions: number;
    let user: string;
    onMount(() => {
        // max timeout for loading

        setTimeout(() => {
            _init().then((data) => {
                user = data.username
            })
            $sc.on('action-tick', (context: JSON) => {
                $loaded['area'] = true;
                $loaded['rarity'] = true;   
                actions = $actionsLeft
            })
        }, 1000)
    })

    const _init = async () => {
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