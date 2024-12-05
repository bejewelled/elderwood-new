<div class='grid grid-cols-1 border-2 border-slate-700 max-h-[270px] overflow-y-auto'>
    <!-- send message -->
    <form class='col-span-1 grid grid-cols-12' on:submit|preventDefault={() => sendMessage()}>
        <input class='col-span-11 text-sm bg-slate-100
        border-[1px] border-slate-700 mt-1 mx-1 px-1' type='text' bind:value={message} />
        <button class='col-span-1 mt-1 mx-1 border-2 border-slate-700
         game-btn-chat text-slate-700' type='submit'>Send</button>
    </form>
    {#key $messages}
        {#if $messages && typeof $messages[Symbol.iterator] === 'function'}
        {#each ($messages || []) as m, i}
            <div class='col-span-1 max-h-[12px]'>
                <span class='pl-1 text-slate-700 col-span-1 text-sm'>
                    <strong>
                        [{m.createdAt.slice(11, 16)}]
                        {m.title || ''} {m.username}: </strong>
                </span>
                <span class='text-slate-400 col-span-8 text-sm text-left'>
                    {m.message}
                </span>
            </div>
        {/each}
        {/if}
    {/key}
</div>


<script lang='ts'>
    import {sc} from '../../../lib/data/socket'
    import {messages} from '../../../lib/data/game'
    import {onMount, onDestroy} from 'svelte'

    let message = ''
    $: msgs = $messages

    onMount(() => {
        $sc.on('connect', () => {
            console.log('oi oi oi')
            $sc.on('get-chat-return', (res: any) => {
                console.log('chat gotten')
                $messages = res.messages
            })
        })

        $sc.on('new-message', (res: any) => {
                console.log('new message')
                $messages = [res.message, ...$messages]
                if ($messages.length > 100) $messages.pop()
                
            })
        $sc.emit('get-chat', {})
    })

    const sendMessage = () => {
        $sc.emit('send-message', {message: message})
        message = ''
    }

</script>

