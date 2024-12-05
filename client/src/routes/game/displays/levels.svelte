<div class='wrapper w-full py-[1px]'>
    <!-- Current Profession Level -->
    <div class='border-[1px] py-[1px]h-[20px] bg-slate-700 relative'>
        <div class='bg-fuchsia-600 h-[18px]' style="width: {skillPercent}">
            <div class='absolute inset-0 flex items-center justify-center'>
                <div class='group'>
                    <div class='text-center text-slate-100 text-xs'> 
                        <strong>{cap($actionType)} 
                        {!$actionsOn ? '...' : f($skillXP['level'] || 0)}</strong> &nbsp;&nbsp;
                        [{f($skillXP['xp'])} / {f($skillXP['xpNext'])}]
                    </div>
                    <div class='tooltip'>
                        <strong>{cap($actionType)}</strong> XP is gained from any {$actionType} action. <br/>
                        Every 5 skill levels gives +1 to all rolls in that skill. <br/>
                        Skill levels increase mastery XP while in that skill. <br/>
                        Mastery XP increased by 
                        <span class='text-fuchsia-400 font-bold'>
                            {fp($skillXP['level']*0.002 || 0)}
                        </span>
                        when {$actionType}.
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Mastery Level -->
    <div class='border-[1px] bg-slate-700 relative'>
        <div class='bg-sky-600 h-[18px]' style="width: {masteryPercent}">
            <div class='absolute inset-0 flex items-center justify-center'>
                <div class='group'>
                    <div class='text-center text-slate-100 text-xs'> 
                        <strong>Mastery {f($masteryXP['level'] || 0)}</strong> &nbsp;&nbsp;
                        [{f($masteryXP['xp'])} / {f($masteryXP['xpNext'])}]
                    </div>
                    <div class="tooltip">
                        <strong>Mastery</strong> is shared across all actions. 
                        Mastery levels increase skill XP. <br/>
                        Skill XP increased by 
                        <span class='text-sky-400 font-bold'>
                            {fp($masteryXP['level']*0.003 || 0)}.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- # actions left -->
    <div class='border-[1px] bg-slate-700 relative progress-container'>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore missing-declaration -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class='progress-bar h-[18px] {$refreshingActions ? 
        'bg-lime-700  cursor-pointer pointer-events-none'
         : 'bg-lime-600 hover:bg-lime-500'}'
        style='width: {pbarw}%' on:click={() => refreshActions()}>
            <div class='absolute inset-0 flex items-center justify-center'>
                <div class='text-center
                {$refreshingActions? 'text-slate-300 select-none cursor-default pointer-events-none' 
                : 'text-slate-100 cursor-pointer'} select-none text-xs'> 
                    {#if $actionPrep}
                    Loading actions...
                    {:else}
                    {$actionsLeft} actions remaining
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<script lang="ts">
    import {onMount, onDestroy} from 'svelte';
    import {sc} from '../../../lib/data/socket';
    import {actionsLeft, actionType, actionPrep,
        actionsOn, refreshingActions} from '../../../lib/data/state';
    import {f, fp} from '../../../lib/formatting'

    import {masteryXP, skillXP, skillLevels} from '../../../lib/data/player';

    $: masteryPercent = `${Math.min(1,($masteryXP['xp']||0)/($masteryXP['xpNext']||100)) * 100}%`;
    $: skillPercent = `${Math.min(1,($skillXP['xp']||0)/($skillXP['xpNext']||100)) * 100}%`;

    let pbarw = 0;
    let nextAction = Date.now();
    onMount(() => {
        setTimeout(() => {
            $sc.on('action-tick', (context: JSON) => {
                $actionPrep = false;
                $actionsLeft = context['actionsLeft'];
                nextAction = context['time'] + context['interval']
                startPBarUpdater();
            })
            $sc.on('connect-fetch-confirm', (data: JSON) => {
                endPbarUpdater();
                console.log('fetched (levels)')
            })
            $sc.on('action-end-confirm', (context: JSON) => {
                console.log('action ended')
                endPbarUpdater();
            })
        }, 1125)
    })

    let interval: any;
    const startPBarUpdater = () => {
        console.log('starting pbar updater')
        clearInterval(interval);
        interval = setInterval(() => {
            pbarw = Math.min(100,(Date.now() - nextAction) / 60);
            if (pbarw > 100) clearInterval(interval);
        }, 1000/60)
    }

    const endPbarUpdater = () => {
        console.log('ending pbar updater')
        clearInterval(interval);
        pbarw = 0;
    }

    const refreshActions = () => {
        if ($refreshingActions) return;
        $refreshingActions = true;
        $sc.emit('action-refresh', {})
        
    }

    const cap = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

</script>